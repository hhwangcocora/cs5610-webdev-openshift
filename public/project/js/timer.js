/**
 * Created by hhwang on 3/8/15.
 */

app.controller('timerController', function($scope, $http) {
    var controller = this
    this.tags = [
        { tagName: 'web', subTags: ['experiment', 'project', 'course']},
        { tagName: 'ir', subTags: ['homework1', 'homework2']},
        { tagName: 'mapreduce', subTags: ['assignment1', 'assginment2', 'project', 'paper reading']},
        { tagName: 'others', subTags: ['other']}
    ]
    this.activatedTag = this.tags[0]
    this.activatedSubTag = this.activatedTag.subTags[0]

    this.isTagActivated = function(tn) {
        if (tn == this.activatedTag.tagName || tn == this.activatedSubTag) {
            return true
        } else {
            return false
        }
    }

    this.chooseL1Tag = function(chosenTag) {
        this.activatedTag = chosenTag;
        this.activatedSubTag = '';
    }

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
