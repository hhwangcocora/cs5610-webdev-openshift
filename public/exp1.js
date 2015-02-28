/**
 * Created by hhwang on 2/26/15.
 */
var app = angular.module('courseApp', [])
app.controller('courseController', function ($scope){
    $scope.currentUser = 'bob'

    // initialize the data
    $.get('/allCourses').success(function(resp, status){
        $scope.$apply(function(){
            $scope.allCourses = resp
        })
    })

    $.get('/registeredCourses').success(function(resp, status){
        $scope.$apply(function() {
            $scope.registeredCourses = resp
        })
    })

    $scope.myFilter = function(course) {
        var filter = new RegExp($scope.searchFilter, 'i')
        return !filter || filter.test(course.number) || filter.test(course.name) ||
            filter.test(course.campus) || filter.test(course.professor) || filter.test(course.classroom)
    }

    $scope.registerCourse = function(courseNumber) {
        for (var idx in $scope.allCourses) {
            if ($scope.allCourses[idx].number === courseNumber) {
                $.post('/' + idx).success(function(resp, status){
                    $scope.$apply(function() {
                        $scope.registeredCourses = resp
                    })
                })
                break;
            }
        }
    }

    $scope.dropCourse = function(courseNumber) {
        for (var idx in $scope.allCourses) {
            if ($scope.allCourses[idx].number === courseNumber) {
                $.ajax({
                    url: '/' + idx,
                    type: 'DELETE',
                    success: function(resp) {
                        $scope.$apply(function() {
                            $scope.registeredCourses = resp
                        })
                    }
                });
                break;
            }
        }
    }
})

