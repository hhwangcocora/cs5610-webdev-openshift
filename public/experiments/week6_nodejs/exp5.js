
var app = angular.module('timerApp', [])
app.controller('timerController', function ($scope, $http){
    var controller = this;
    controller.tasks = []

    $http.get('/week6exp5/tasks').success(function(resp, status) {
        controller.tasks = resp
    })

    controller.task = {}
    controller.hours = 0
    controller.minutes = 0
    controller.seconds = 0
    controller.inprogress = false

    this.startTask = function() {
        controller.inprogress = true
        controller.task['startTime'] = new Date().toString()
        controller.task['taskName'] = controller.taskName
        controller.totalSeconds = 0
        controller.timer = setInterval(function(){
            $scope.$apply(function(){
                ++controller.totalSeconds
                controller.hours = parseInt(controller.totalSeconds/3600)
                controller.minutes = parseInt((controller.totalSeconds%3600)/60)
                controller.seconds = (controller.totalSeconds%3600)%60
            })
        }, 1000)
    }

    this.stopTask = function() {
        controller.inprogress = false
        clearInterval(controller.timer)

        controller.task['stopTime'] = new Date().toString()
        controller.task['duration'] = '' + controller.hours + ' hours ' + controller.minutes + ' minutes ' + controller.seconds + ' seconds'

        var newTask = {
            startTime: controller.task['startTime'],
            stopTime: controller.task['stopTime'],
            taskName: controller.task['taskName'],
            duration: controller.task['duration']
        }

        $http.put('/week6exp5/addTask', newTask).success( function(resp, status){
            controller.tasks = resp
        })


        controller.hours = 0
        controller.minutes = 0
        controller.seconds = 0

        controller.taskName = ''
    }

})
