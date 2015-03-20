/**
 * Created by hhwang on 3/8/15.
 */

app.controller('timerController', function($scope, httpService) {
    var controller = this

    this.currentStatus = 'init' //init, ready, inProgress, pause

    /* TAG */

    this.tags = [
        { tagName: 'web', subTags: ['experiment', 'project', 'course']},
        { tagName: 'ir', subTags: ['homework1', 'homework2']},
        { tagName: 'mapreduce', subTags: ['assignment1', 'assginment2', 'project', 'paper reading']},
        { tagName: 'others', subTags: ['other']}
    ]
    this.activatedTag = {}
    this.activatedSubTag = ''

    this.isTagActivated = function(tn) {
        if (tn == this.activatedTag.tagName || tn == this.activatedSubTag) {
            return true
        } else {
            return false
        }
    }

    this.chooseL1Tag = function(chosenTag) {
        if (this.currentStatus == 'inProgress' || this.currentStatus == 'pause') {
            return;
        }
        if (chosenTag == this.activatedTag) {
            this.activatedTag = {}
            this.currentStatus = 'init'
        } else {
            this.activatedTag = chosenTag
        }

        this.activatedSubTag = ''
    }

    this.chooseL2Tag = function(chosenSubTag) {
        if (this.currentStatus == 'inProgress' || this.currentStatus == 'pause') {
            return;
        }
        if (this.activatedSubTag == chosenSubTag) {
            this.activatedSubTag = ''
            this.currentStatus = 'init'
        } else {
            this.activatedSubTag = chosenSubTag;
            this.currentStatus = 'ready'
        }
    }

    /* TIMER */

    this.counter = {
        hours: 0,
        minutes: 0,
        seconds: 0
    }

    this.inProgressTask = {}

    this.enableStartButton = function() {
        if (this.currentStatus == 'ready' || this.currentStatus == 'pause') {
            return true;
        }
        return false;
    }
    this.enablePauseButton = function() {
        if (this.currentStatus == 'inProgress') {
            return true;
        }
        return false;
    }
    this.enableStopButton = function() {
        if (this.currentStatus == 'inProgress' || this.currentStatus == 'pause') {
            return true;
        }
        return false;
    }

    var formatTimer = function(seconds) {
        return {
            hours: parseInt(seconds/3600),
            minutes: parseInt((seconds%3600)/60),
            seconds: (seconds%3600)%60
        }
    }

    this.startTask = function() {
        if (this.currentStatus != 'pause') {
            this.inProgressTask['startTime'] = new Date()
            this.inProgressTask['totalSeconds'] = 0
        }
        this.currentStatus = 'inProgress'
        this.timer = setInterval(function(){
            $scope.$apply(function(){
                ++controller.inProgressTask['totalSeconds']
                controller.counter = formatTimer(controller.inProgressTask['totalSeconds'])
            })
        }, 1000)
    }

    this.pauseTask = function() {
        this.currentStatus = 'pause'
        clearInterval(this.timer)
    }

    this.stopTask = function() {
        this.currentStatus = 'init'
        clearInterval(this.timer)
        this.inProgressTask['stopTime'] = new Date()

        var finishedTask = {
            l1Tag: this.activatedTag.tagName,
            l2Tag: this.activatedSubTag,
            startTime: this.inProgressTask['startTime'],
            stopTime: this.inProgressTask['stopTime'],
            duration: formatTimer(this.inProgressTask['totalSeconds']),
            totalSeconds: this.inProgressTask['totalSeconds']
        }
        //this.recentTasks.push(finishedTask)
        this.counter = formatTimer(0)
        this.activatedTag = {}
        this.activatedSubTag = ''
        httpService.addTask(finishedTask).then(function(resp) {
            controller.recentTasks.push(resp)
        }, function(resp) {
            $scope.errorMessage = 'Failed to save task to server. '
        })
    }

    /* TASK TABLE */
    this.recentTasks = []
})
