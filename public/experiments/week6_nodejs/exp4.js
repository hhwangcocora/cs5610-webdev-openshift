var app = angular.module('todoApp', [])
app.controller('todoController', function ($scope, $http){
    var rootpath = '/week6exp4'
    $scope.todoItems = []


    $http.get(rootpath + '/todoItems').success(function(resp, status){
        $scope.todoItems = resp
    })


    $scope.removeItem = function(desp) {

        $http.put(rootpath + '/delete', {description: desp}).success(function(resp, status){
            $scope.todoItems = resp
        })
    }

    $scope.addItem = function() {
        var description = $scope.newTodo
        if (!description) {
            return
        }

        for (var idx in $scope.todoItems) {
            if (description === $scope.todoItems[idx].description) {
                return
            }
        }

        $http.put(rootpath + '/add', {check: false, description: description}).success(function(resp, status){
            $scope.todoItems = resp
        })
        $scope.newTodo = ''
    }

    $scope.toggleItem = function(desp) {
        $http.put(rootpath + '/toggle', {description: desp}).success(function(resp, status){
            $scope.todoItems = resp
        })
    }
})

