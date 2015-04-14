/**
 * Created by hhwang on 4/13/15.
 * This is the projects page
 */
app.controller('projectsController', function($scope) {
    var controller = this

    $scope.allProjects = {
        1: {
            id: 1,
            name: 'Web Project',
            tasks: [1, 2, 3],
            contributors: [1, 2],
            description: 'NEU CS5610 web development final projects. ',
            owner: 1,
            iconUrl: 'http://aislabs.com/wp-content/uploads/2014/08/ais-web-development.png'
        },
        2: {
            id: 2,
            name: 'Web Experiments',
            tasks: [],
            contributors: [1, 2],
            description: 'NEU CS5610 web development experiments. ',
            owner: 2,
            iconUrl: 'http://aislabs.com/wp-content/uploads/2014/08/ais-web-development.png'
        },
        3: {
            id: 3,
            name: 'IR assignment 3',
            tasks: [4],
            contributors: [2, 3, 4],
            description: 'Information retrieval assignment 3. ',
            owner: 2,
            iconUrl: 'http://aislabs.com/wp-content/uploads/2014/08/ais-web-development.png'
        },
        4: {
            id: 4,
            name: 'IR assignment 4',
            tasks: [],
            contributors: [1, 3, 4],
            description: 'Information retrieval assignment 4. ',
            owner: 1,
            iconUrl: 'http://aislabs.com/wp-content/uploads/2014/08/ais-web-development.png'
        }
    }

    $scope.allUsers = {
        1: {
            id: 1,
            username: 'lily',
            ownedProjects: [1, 4],
            joinedProjects: [1, 2, 4]
        },
        2: {
            id: 2,
            username: 'lucy'
        },
        3: {
            id: 3,
            username: 'lei'
        },
        4: {
            id: 4,
            username: 'meimei'
        }
    }

    $scope.tasks = {
        1: {
            id: 1,
            name: 'homepage',
            description: 'setup homepage html and javascript',
            completed: true
        },
        2: {
            id: 2,
            name: 'timer',
            description: 'setup timer html and javascript',
            completed: false
        },
        3: {
            id: 3,
            name: 'unit test',
            description: 'unit test',
            completed: false
        },
        4: {
            id: 4,
            name: 'integration test',
            description: 'integration test',
            completed: false
        }
    }

    $scope.workRecords = {
        1: {
            user: 1,
            project: 1,
            task: 1,
            startTime: new Date(2015, 3, 12, 3, 4, 0),
            endTime: new Date(2015, 3, 12, 5, 6, 0),
            totalSeconds: 6500
        },
        2: {
            user: 2,
            project: 1,
            task: 2,
            startTime: new Date(2015, 3, 13, 1, 4, 0),
            endTime: new Date(2015, 3, 13, 3, 6, 0),
            totalSeconds: 6500
        },
        3: {
            user: 2,
            project: 1,
            task: 1,
            startTime: new Date(2015, 3, 12, 3, 4, 0),
            endTime: new Date(2015, 3, 12, 5, 6, 0),
            totalSeconds: 6500
        },
        4: {
            user: 3,
            project: 3,
            task: 4,
            startTime: new Date(2015, 3, 12, 3, 4, 0),
            endTime: new Date(2015, 3, 12, 5, 6, 0),
            totalSeconds: 6500
        }
    }

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

    $scope.getAllProjectIds = function() {
        var result = []
        for (var p in $scope.allProjects) {
            result.push(p)
        }
        return result
    }

    $scope.showProjectDetails = function(pid) {
        $scope.showedProjectId = pid
        // filter out all the work records belong to this project, and organize with taskId as key
        // get from backend server
        $scope.showedWorkRecords = {
            1: [1, 3],
            2: [2],
            3: []
        }
        // fill in the total/me contributed hours
        $scope.tasks[1].totalSeconds = 3.4
        $scope.tasks[2].totalSeconds = 2.6
        $scope.tasks[3].totalSeconds = 0
        $scope.tasks[1].myHours = 1.2
        $scope.tasks[2].myHours = 2.2
        $scope.tasks[3].myHours = 0
    }

    $scope.goBackToProjects = function() {
        $scope.showedProjectId = null
    }

    $scope.currentUserId = 1
    $scope.currentUser = $scope.allUsers[$scope.currentUserId]
    $scope.showedProjectId = null
    $scope.showedRecords = {}  // task id -> [work record ids]

})