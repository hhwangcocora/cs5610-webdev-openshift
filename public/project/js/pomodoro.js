
var app = angular.module('timerApp', ['ngRoute'])

app.controller('navController', function ($scope, $location, httpService){
    var controller = this



    $scope.$watch('currentUser', function(){
        if ($scope.currentUser) {
            $location.path('/timer')
        } else {
            $location.path('/home')
        }
    })
    $scope.$watch('errorMessage', function() {
        if ($scope.errorMessage) {
            $('#messageModal').modal({show: true})
        } else {
            $('#messageModal').modal({show: false})
        }
    })

    /* Login/logout */

    var loggedin = function() {
        httpService.loggedin().then(
            function(resp) {
                if (resp.username) {
                    $scope.currentUser = resp.username
                } else {
                    $scope.currentUser = ''
                }
            }, function(resp) {
                $scope.currentUser = ''
                $scope.errorMessage = resp.message
            }
        )
    }

    loggedin()

    this.login = function() {
        var account = this.account;
        if (!account || !account.username || !account.password) {
            return
        }
        httpService.login(account.username, account.password).then(
            function(resp) {
                // success
                console.log('Login succeeded with resp: ' + resp);
                $scope.currentUser = resp.username;
            }, function(resp) {
                // fail
                console.log('Login failed with resp: ' + resp);
                $scope.errorMessage = resp.message
            }
        )
        this.account = {}
    }

    this.logout = function() {
        $scope.currentUser = ''
        httpService.logout()
    }

    /* Register */

    this.inRegister = true

    this.matchPassword = function() {
        if (this.newUser) {
            return this.newUser.password1 === this.newUser.password2
        } else {
            return false
        }
    }

    this.register = function() {
        httpService.register(this.newUser.username, this.newUser.password1).then(
            function(resp) {
                if (resp.username) {
                    controller.inRegister = false
                    controller.registerError = ''
                    setTimeout(function () {
                        $scope.$apply(function() {
                            $('#registerModal').modal('hide')
                            controller.inRegister = true
                            controller.newUser = {}
                        })
                    }, 2000);
                } else {
                    controller.registerError = 'Register failed. '
                    if (resp.message) {
                        controller.registerError += resp.message
                    }
                }

            }, function(resp) {
                controller.registerError = 'Register failed. ' + resp.message
            }
        )
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
                when(rootPath + '/dashboard', {
                    templateUrl: 'dashboard.html',
                    controller: 'dashboardController',
                    controllerAs: 'dashboardCtrl'
                }).
                when(rootPath + '/profile', {
                    templateUrl: 'profile.html'
                }).
                otherwise(rootPath + '/home')
        }]
)

