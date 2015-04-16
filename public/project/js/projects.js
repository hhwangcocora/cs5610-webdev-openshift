/**
 * Created by hhwang on 4/13/15.
 * This is the projects page
 */
app.controller('projectsController', function($scope, httpService) {
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
            result.push[u]
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
        var task = $scope.tasks[tid]
        var filter = new RegEx($scope.taskFilterString, 'i')
        return !filter || filter.test(task.name) || filter.test(task.description)
    }


    $scope.addNewProject = function(newProject) {
        httpService.addProject(newProject).then(function(resp) {
            controller.loadData()
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
        // TODO: work on this! Use routing to support task page
    }

    $scope.goBackToProjects = function() {
        $scope.showedProjectId = null
    }


})