
var app = angular.module('timerApp', ['ngRoute', 'ngAnimate'])

app.controller('navController', function ($scope, $location, $rootScope, httpService){
    var controller = this

    /* Watched variables */

    // currentUser is the current login user name
    $scope.$watch('currentUser', function(){
        if ($scope.currentUser) {
            $location.path('/timer')
        } else {
            $location.path('/home')
        }
    })

    // display error message modal once there is any "errorMessage"
    $scope.$watch('errorMessage', function() {
        if ($scope.errorMessage) {
            $('#messageModal').modal({show: true})
        } else {
            $('#messageModal').modal({show: false})
        }
    })

    $scope.$on('startTimerEvent', function(event, project, task) {
        // get event from project page, switch to timer page and send event to the timer controller
        $location.path('/timer')
        console.log('project:' + project + ', task: ' + task)
        $rootScope.project = project
        $rootScope.task = task
    })


    /* Navigation tab control */

    // If current tab is active, controls the "active" ng-class
    $scope.isActive = function(route) {
        return route == $location.path()
    }


    /* Login/logout */

    // Check if user already logged in, set "currentUser" accordingly
    var loggedin = function() {
        httpService.loggedin().then(
            function(resp) {
                if (resp.username) {
                    $scope.currentUser = resp
                } else {
                    $scope.currentUser = ''
                }
            }, function(resp) {
                $scope.currentUser = ''
                $scope.errorMessage = resp.message
            }
        )
    }


    // Login, the account is controller's "account {username, password}"
    this.login = function() {
        var account = this.account;  // account is the username and password in the input fields
        if (!account || !account.username || !account.password) {
            return
        }
        httpService.login(account.username, account.password).then(
            function(resp) {
                // success
                console.log('Login succeeded with resp: ' + resp);
                $scope.currentUser = resp;
            }, function(resp) {
                // fail
                console.log('Login failed with resp: ' + resp);
                $scope.errorMessage = resp.message
            }
        )
        this.account = {}
    }

    // Logout
    this.logout = function() {
        $scope.currentUser = ''
        httpService.logout()
    }


    /* Register */

    this.registerInProgress = true  // registerInProgress controls the register form display and success message
                                 // false only between register response with success and modal still in display

    this.matchPassword = function() {
        if (this.newUser) {
            return this.newUser.password1 === this.newUser.password2
        } else {
            return false
        }
    }

    // register as a new user, controller's "newUser {username, password1}"
    this.register = function() {
        httpService.register(this.newUser.username, this.newUser.password1).then(
            function(resp) {
                if (resp.username) {
                    // Register succeeded
                    controller.registerInProgress = false
                    controller.registerError = ''
                    controller.account = {username: resp.username, password: ''} // fill username field with this registered username
                    // Display the success message and wait for 2 seconds before hide register modal
                    setTimeout(function () {
                        $scope.$apply(function() {
                            $('#registerModal').modal('hide')  // hide register modal
                            controller.registerInProgress = true
                            controller.newUser = {}  // clear the register information on the form
                        })
                    }, 2000);
                } else {
                    // Register failed
                    controller.registerError = 'Register failed. '
                    if (resp.message) {
                        controller.registerError += resp.message  // display register failure message
                    }
                }

            }, function(resp) {
                controller.registerError = 'Register failed. ' + resp.message
            }
        )
    }


    // First of all, try to login
    loggedin()







    /* Utility */
    $scope.convertTo2Digits = function(number) {
        var result = '' + number
        if (result.length == 1) {
            return '0' + number
        }
        return number
    }

    $scope.secToHours = function(sec) {
        return ( sec / 3600).toFixed(2)
    }

    $scope.formatDate = function(date) {
        console.log(date)
        return '' + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
        + ' ' + date.getHours() + ':' + date.getMinutes()
     }





})




app.filter('fixedTowLen', function () {
    return function (number) {
        var num = parseInt(number, 10);
        if (isNaN(num)) {
            return num;
        }
        num = ''+num;
        while (num.length < 2) {
            num = '0'+num;
        }
        return num;
    }
})



/* Routing */

app.config(['$routeProvider',
        function($routeProvider){
            var rootPath = ''
            $routeProvider.
                when(rootPath + '/home', {
                    templateUrl: 'home.html',
                    controller: 'homeController',
                    controllerAs: 'homeCtrl'
                }).
                when(rootPath + '/timer', {
                    templateUrl: 'timer.html',
                    controller: 'timerController',
                    controllerAs: 'timerCtrl'
                }).
                when(rootPath + '/users/:id', {
                    templateUrl: 'users.html',
                    controller: 'usersController',
                    controllerAs: 'usersCtrl'
                }).
                when(rootPath + '/profile', {
                    templateUrl: 'profile.html',
                    controller: 'profileController',
                    controllerAs: 'profileCtrl'
                }).
                when(rootPath + '/projects', {
                    templateUrl: 'projects.html',
                    controller: 'projectsController',
                    controllerAs: 'projectsCtrl'
                }).
                otherwise(rootPath + '/home')  // default to homepage
        }]

)

