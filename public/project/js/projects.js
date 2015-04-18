/**
 * Created by hhwang on 4/13/15.
 * This is the projects page
 */
app.controller('projectsController', function($scope, $location, httpService) {
    var controller = this

    /* Load project lists */

    controller.loadData = function() {

        httpService.getProjectList(null, null).then(function(resp) {
            if (resp) {
                $scope.allProjects = resp
                $scope.allProjectIds = controller.getAllProjectIds()
            } else {
                $scope.allProjects = {}
            }
        }, function(resp) {
            $scope.allProjects = {}
            $scope.errorMessage = resp.message
        })

        //$scope.ownedProjects = {}
        //httpService.getProjectList($scope.currentUser.id, null).then(function(resp) {
        //    if (resp) {
        //        $scope.ownedProjects = resp
        //    }
        //}, function(resp) {
        //    $scope.errorMessage = resp.message
        //})
        //
        //$scope.contributedProjects = {}
        //httpService.getProjectList(null, $scope.currentUser.id).then(function(resp) {
        //    if (resp) {
        //        $scope.contributedProjects = resp
        //    }
        //}, function(resp) {
        //    $scope.errorMessage = resp.message
        //})

        httpService.getUserList().then(function(resp) {
            if (resp) {
                $scope.allUsers = resp
                $scope.allUserIds = controller.getAllUserIds()
                $scope.currentUser = $scope.allUsers[$scope.currentUserId]
            } else {
                console.log('getUserList failed')
                $scope.allUsers = {}
            }
        }, function(resp) {
            console.log('getUserList failed')
            $scope.allUsers = {}
            $scope.errorMessage = resp.message
        })
    }


    controller.getAllProjectIds = function() {
        var result = []
        for (var p in $scope.allProjects) {
            result.push(p)
        }
        return result
    }

    controller.getAllUserIds = function() {
        var result = []
        for (var u in $scope.allUsers) {
            result.push(u)
        }
        return result
    }

    $scope.currentUserId = $scope.currentUser ? $scope.currentUser.id : 0   // need to deal with no user login
    $scope.showedProjectId = null
    $scope.showedRecords = {}  // task id -> [work record ids]
    $scope.allProjectIds = []
    $scope.allUserIds = []

    controller.loadData()
    console.log($scope.currentUser)

    $scope.currentTasks = {}
    $scope.allTasks = []
    $scope.ownedTasks = []
    $scope.newProject = {name: '', description: '', picUrl: ''}
    $scope.newTask = {name: '', description: ''}


    // Is current user a contributor of the project
    $scope.isContributor = function(pid) {
        return $scope.allProjects[pid].contributors.indexOf($scope.currentUserId) > -1
    }

    $scope.projectFilter = function(pid) {
        var project = $scope.allProjects[pid]
        var filter = new RegExp($scope.projectFilterString, 'i')
        return !filter || filter.test(project.name) || filter.test(project.description)
            || filter.test($scope.allUsers[project.owner].username)
    }

    $scope.taskFilter = function(tid) {
        var task = $scope.currentTasks[tid]
        var filter = new RegExp($scope.taskFilterString, 'i')
        return !filter || filter.test(task.name) || filter.test(task.description)
    }


    $scope.addNewProject = function(newProject) {
        if (newProject.name.length == 0 || newProject.description == 0) {
            return;
        }
        httpService.addProject(newProject).then(function(resp) {
            controller.loadData()
            $scope.newProject = {
                name: '',
                description: '',
                picUrl: ''
            }
        }, function(resp) {
            $scope.errorMessage = resp.message
        })
    }

    $scope.joinProject = function(pid) {
        httpService.joinProject(pid).then(function(resp) {
            controller.loadData()
        }, function(resp) {
            $scope.errorMessage = resp.message
        })
    }

    $scope.dropProject = function(pid) {
        httpService.dropProject(pid).then(function(resp) {
            controller.loadData()
        }, function(resp) {
            $scope.errorMessage = resp.message
        })
    }

    $scope.showProjectDetails = function(pid) {
        // get task by project and then traverse them
        httpService.getTaskByProject(pid).then(function(resp) {
            $scope.currentTasks = resp
            var temp1 = []
            var temp2 = []
            for (var t in $scope.currentTasks) {
                temp1.push(t)
                if ($scope.currentTasks[t].owner == $scope.currentUserId) {
                    temp2.push(t)
                }
            }

            $scope.allTasks = temp1
            $scope.ownedTasks = temp2
            $scope.showedProjectId = pid

            console.log('Selected project is ' + pid)
            console.log($scope.allTasks)
            console.log($scope.ownedTasks)
        }, function(resp) {
            $scope.errorMessage = resp.message
        })
    }

    $scope.goBackToProjects = function() {
        $scope.showedProjectId = null
    }

    $scope.showDetailPage = function() {
        return $scope.showedProjectId != null
    }

    $scope.addNewTask = function(newTask) {
        if (newTask.name.length == 0 || newTask.description.length == 0) {
            return
        }
        var t = {
            name: newTask.name,
            description: newTask.description,
            project: $scope.showedProjectId
        }
        httpService.addTask(t).then(function(resp) {
            $scope.showProjectDetails($scope.showedProjectId)

            $scope.newTask = {
                name: '',
                description: ''
            }
        }, function(resp) {
            $scope.errorMessage = resp.message
        })

    }

    $scope.ownTask = function(tid) {
        httpService.ownTask(tid).then(function(resp) {
            $scope.showProjectDetails($scope.showedProjectId)
        }, function(resp) {
            $scope.errorMessage = resp.message
        })
    }

    $scope.notOwnable = function(tid) {
        return ($scope.currentTasks[tid].owner != null && $scope.currentTasks[tid].owner.length > 0)
        || ($scope.currentUser.contributedProjects.indexOf($scope.showedProjectId) < 0)
    }

    $scope.projectOwnedByUser = function() {
        return ($scope.currentUser.contributedProjects.indexOf($scope.showedProjectId) >= 0)
    }

    $scope.dropTask = function(tid) {
        httpService.dropTask(tid).then(function(resp) {
            $scope.showProjectDetails($scope.showedProjectId)
        }, function(resp) {
            $scope.errorMessage = resp.message
        })
    }

    $scope.completeTask = function(tid) {
        httpService.completeTask(tid).then(function(resp) {
            $scope.showProjectDetails($scope.showedProjectId)
        }, function(resp) {
            $scope.errorMessage = resp.message
        })
    }

    $scope.startTimer = function(tid) {
        console.log('start timer')
        $scope.$emit('startTimerEvent', $scope.showedProjectId, tid)
    }

    $scope.showStats = function(tid) {
        $scope.taskStatsId = tid
        $('#statsModal').modal({
            show: true
        })
    }
})