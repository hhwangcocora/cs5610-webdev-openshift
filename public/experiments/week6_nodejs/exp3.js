/**
 * Created by hhwang on 2/26/15.
 */
var app = angular.module('courseApp', [])
app.controller('courseController', function ($scope, $http){
    $scope.currentUser = ''
    $scope.registerInProgress = true
    var rootpath = '/week6exp3'

    // initialize the data
    $.get(rootpath + '/allCourses').success(function(resp, status){
        $scope.$apply(function(){
            $scope.allCourses = resp
        })
    })

    $scope.loginf = function() {
        $http.put(rootpath + '/login?username=' + $scope.login.username + '&password=' + $scope.login.password).success(function(resp, status){
            $scope.currentUser = resp.username
        })
    }

    $scope.$watch('currentUser', function() {
        if ($scope.currentUser) {
            $http.get(rootpath + '/' + $scope.currentUser +'/registeredCourses').success(function(resp, status){
                $scope.registeredCourses = resp
            })
        }
    })

    $scope.logout = function() {
        $scope.currentUser = ''
    }

    $scope.registerf = function() {
        $http.put(rootpath + '/register?username=' + $scope.register.username + '&password=' + $scope.register.password1).success(function(resp, status){
            if (resp.username) {
                $scope.registerInProgress = false
                $scope.registerError = ''
                setTimeout(function () {
                    $scope.$apply(function() {
                        $('#registerModal').modal('hide')
                        $scope.register = {}
                        $scope.registerInProgress = true
                    })
                }, 2000);
            } else {
                $scope.registerError = 'Register failed. Username exists, try another username.'
            }
        })
    }

    $scope.matchPassword = function() {
        if ($scope.register) {
            return $scope.register.password1 === $scope.register.password2
        } else {
            return false
        }
    }

    $scope.myFilter = function(course) {
        var filter = new RegExp($scope.searchFilter, 'i')
        return !filter || filter.test(course.number) || filter.test(course.name) ||
            filter.test(course.campus) || filter.test(course.professor) || filter.test(course.classroom)
    }

    $scope.registerCourse = function(courseNumber) {
        for (var idx in $scope.allCourses) {
            if ($scope.allCourses[idx].number === courseNumber) {
                $.post(rootpath +'/' + $scope.currentUser + '/' + idx).success(function(resp, status){
                    $scope.registeredCourses = resp
                })
                break;
            }
        }
    }

    $scope.dropCourse = function(courseNumber) {
        for (var idx in $scope.allCourses) {
            if ($scope.allCourses[idx].number === courseNumber) {
                $http.delete(rootpath + '/' + $scope.currentUser + '/' + idx).success(function (resp, status) {
                    $scope.registeredCourses = resp
                })
                break;
            }
        }
    }
})

