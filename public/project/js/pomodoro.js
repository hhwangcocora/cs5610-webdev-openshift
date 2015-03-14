
var app = angular.module('timerApp', ['ngRoute'])

app.controller('navController', function ($scope, $location, httpService){
    $scope.currentUser = 'lily'
    $scope.$watch('currentUser', function(){
        if ($scope.currentUser) {
            $location.path('/project/timer')
        } else {
            $location.path('/project/home')
        }
    })

    this.login = function() {
        var account = this.account;
        httpService.login(account.username, account.password).then(
            function(resp) {
                // success
                console.log('Login succeeded with resp: ' + resp);
                $scope.currentUser = resp.username;
            }, function(resp) {
                // fail
                console.log('Login failed with resp: ' + resp);
            }
        );
    }



})

app.config(['$routeProvider',
        function($routeProvider){
            var rootPath = '/project'
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
                otherwise(rootPath + '/home')
        }]
)

