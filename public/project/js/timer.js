/**
 * Created by hhwang on 3/8/15.
 */

app.controller('timerController', function($scope, $rootScope, httpService) {
    var controller = this

    this.currentStatus = 'init' //init, ready, inProgress, pause

    /* TAG */

    $scope.tags = []

    $scope.loadTagAsArgs = function() {
        console.log('rootScope.project: ' + $rootScope.project)
        console.log('rootScope.task: ' + $rootScope.task)
        if ($rootScope.project >= 0 && $rootScope.task >= 0) {
            var project = $rootScope.project
            var task = $rootScope.task
            // loop through the tag
            for (var idx in $scope.tags) {
                if ($scope.tags[idx].id == project) {
                    for (var idx2 in $scope.tags[idx].subTags) {
                        if ($scope.tags[idx].subTags[idx2].id == task) {
                            $scope.activatedTag = $scope.tags[idx]
                            $scope.activatedSubTag = $scope.tags[idx].subTags[idx2]
                            controller.currentStatus = 'ready'
                            break;
                        }
                    }
                    break;
                }
            }
        }
        // clear root scope
        $rootScope.project = undefined
        $rootScope.task = undefined
    }

    $scope.initTags = function() {
        // Initialize tags
        httpService.getTags().then(
            function (resp) {
                $scope.tags = resp
                $scope.loadTagAsArgs()
            }
        )
    }


    $scope.activatedTag = '' // tag object
    $scope.activatedSubTag = '' // sub tag object
    $scope.initTags()
    //$scope.loadTagAsArgs()



    this.isTagActivated = function(tag, level) {
        if ((tag == $scope.activatedTag && level == '1' ) || (level == '2' && tag == $scope.activatedSubTag)) {
            return true
        } else {
            return false
        }
    }

    this.chooseL1Tag = function(chosenTag) {
        console.log(chosenTag)
        if (this.currentStatus == 'inProgress' || this.currentStatus == 'pause') {
            return;
        }
        if (chosenTag == $scope.activatedTag) {
            $scope.activatedTag = ''
            this.currentStatus = 'init'
        } else {
            console.log('set activatedTag')
            $scope.activatedTag = chosenTag
        }

        $scope.activatedSubTag = ''
        this.currentStatus = 'init'
    }

    this.chooseL2Tag = function(chosenSubTag) {
        console.log(chosenSubTag)
        if (this.currentStatus == 'inProgress' || this.currentStatus == 'pause') {
            return;
        }
        if ($scope.activatedSubTag == chosenSubTag) {
            $scope.activatedSubTag = ''
            this.currentStatus = 'init'
        } else {
            $scope.activatedSubTag = chosenSubTag;
            this.currentStatus = 'ready'
        }
    }

    //this.addL1Tag = function() {
    //    if (this.currentStatus == 'inProgress' || this.currentStatus == 'pause') {
    //        return;
    //    }
    //    if (this.newL1Tag) {
    //        for (idx in this.tags) {
    //            if (this.tags[idx].tagName == this.newL1Tag) {
    //                this.newL1Tag = ''
    //                return
    //            }
    //        }
    //        this.tags.push({tagName: this.newL1Tag, subTags: []})
    //        updateTag()
    //        this.newL1Tag = ''
    //    }
    //}
    //
    //this.addL2Tag = function() {
    //    if (this.currentStatus == 'inProgress' || this.currentStatus == 'pause') {
    //        return;
    //    }
    //    if (this.newL2Tag) {
    //        for (idx in this.tags) {
    //            if (this.tags[idx].tagName == this.activatedTag.tagName) {
    //                for (idx2 in this.tags[idx].subTags) {
    //                    if (this.tags[idx].subTags[idx2].tagName == this.newL2Tag) {
    //                        this.newL2Tag = ''
    //                        return
    //                    }
    //                }
    //                this.tags[idx].subTags.push(this.newL2Tag)
    //                updateTag()
    //                this.newL2Tag = ''
    //            }
    //        }
    //    }
    //}
    //
    //this.removeL1Tag = function(tag) {
    //    if (this.currentStatus == 'inProgress' || this.currentStatus == 'pause') {
    //        return;
    //    }
    //    for (idx in this.tags) {
    //        if (this.tags[idx].tagName == tag.tagName) {
    //            this.tags.splice(idx, 1)
    //            updateTag()
    //            if (this.activatedTag.tagName == tag.tagName) {
    //                this.activatedTag = ''
    //                this.currentStatus = 'init'
    //            }
    //            break
    //        }
    //    }
    //}
    //
    //this.removeL2Tag = function(tag) {
    //    if (this.currentStatus == 'inProgress' || this.currentStatus == 'pause') {
    //        return;
    //    }
    //    for (idx in this.tags) {
    //        if (this.tags[idx].tagName == this.activatedTag.tagName) {
    //            for (idx2 in this.tags[idx].subTags) {
    //                if (this.tags[idx].subTags[idx2] == tag) {
    //                    this.tags[idx].subTags.splice(idx2, 1)
    //                    updateTag()
    //                    if (this.activatedSubTag == tag) {
    //                        this.activatedSubTag = ''
    //                        this.currentStatus = 'init'
    //                    }
    //                    break
    //                }
    //            }
    //            break
    //        }
    //    }
    //}

    //var updateTag = function() {
    //    httpService.updateTags(controller.tags).then(function(res) {
    //    })
    //}

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
            projectname: $scope.activatedTag.tagName,
            taskname: $scope.activatedSubTag.tagName,
            startTime: this.dateFormat(this.inProgressTask['startTime']),
            stopTime: this.dateFormat(this.inProgressTask['stopTime']),
            totalSeconds: this.inProgressTask['totalSeconds']
        }
        var record = {
            task: $scope.activatedSubTag.id,
            startTime: this.dateFormat(this.inProgressTask['startTime']),
            stopTime: this.dateFormat(this.inProgressTask['stopTime']),
            totalSeconds: this.inProgressTask['totalSeconds']
        }
        this.recentTasks.push(finishedTask)
        this.counter = formatTimer(0)
        $scope.activatedTag = ''
        $scope.activatedSubTag = ''
        httpService.addNewRecord(record).then(function(resp) {

        }, function(resp) {
            $scope.errorMessage = 'Failed to save task to server. '
        })
    }

    /* TASK TABLE */
    this.recentTasks = []

    this.formatDate = function(date) {
        console.log(date)
        return '' + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
            + ' ' + date.getHours() + ':' + date.getMinutes()
    }
})
