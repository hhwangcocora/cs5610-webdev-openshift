
var app = angular.module('timerApp', ['ngRoute'])

app.controller('navController', function ($scope){
    $scope.currentUser = 'Lily'



})

app.config(['$routeProvider',
        function($routeProvider){
            $routeProvider.
                when('/home', {
                    templateUrl: 'home.html',
                    controller: 'homeController',
                    controllerAs: 'homeCtrl'
                }).
                when('/timer', {
                    templateUrl: '../timer.html',
                    controller: 'timerController',
                    controllerAs: 'timerCtrl'
                }).
                when('/dashboard', {
                    templateUrl: '../dashboard.html',
                    controller: 'dashboardController',
                    controllerAs: 'dashboardCtrl'
                }).
                otherwise('/home')
        }]
)

