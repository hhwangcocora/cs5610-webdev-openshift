#!/bin/env node

/**
 * Created by hhwang on 2/25/15.
 */

var express = require('express')
var bodyParser = require('body-parser')
var app = express()

app.use(express.static(__dirname + '/public'))

var currentUser = 'bob'

// data
var registeredCourses = {
    bob: [1, 3]
}

var courses = [
    {'number':'CS5600', 'name':'Computer System', 'campus':'Boston', 'professor':'Nathaniel Tuck',
        'time':'W: 10:00am to 12:00pm','classroom':'WVH 220'},
    {'number':'CS5610', 'name':'Web Development', 'campus':'Boston', 'professor':'Jose G. Annunziato',
        'time':'WF: 11:45am to 1:25pm','classroom':'WVH 110'},
    {'number':'CS5800', 'name':'Algorithm', 'campus':'Seattle', 'professor':'Ravi Sundaram',
        'time':'T: 6:00pm to 9:00pm','classroom':'WVH 120'},
    {'number':'CS5700', 'name':'Fundamentals of Computer Networking', 'campus':'Boston', 'professor':'David Ross Choffnes',
        'time':'MT: 1:45pm to 3:25pm','classroom':'SH 108'},
    {'number':'CS6240', 'name':'Parallel Data Processing in MapReduce', 'campus':'Boston', 'professor':'Jan Vitek',
        'time':'WF: 11:45am to 1:25pm','classroom':'EVH 440'},
    {'number':'CS6510', 'name':'Advanced Software Development', 'campus':'Online', 'professor':'James Slocum Miller',
        'time':'WF: 11:45am to 1:25pm','classroom':'MH 110'}
]

// helper functions
var getRegisteredCourse = function() {
    var courseIds = registeredCourses[currentUser]
    var result = []
    for (var idx in courseIds) {
        result.push(courses[courseIds[idx]])
    }
    return result

}

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/exp1.html')
})

// Get the user's registered courses
app.get('/registeredCourses', function (req, res) {
    res.json(getRegisteredCourse())
})

// Get all courses
app.get('/allCourses', function (req, res) {
    res.json(courses)
})

// Unregister a course
app.delete('/:courseid', function(req, res) {
    var courseId = req.params.courseid
    registeredCourses[currentUser].splice(registeredCourses[currentUser].indexOf(courseId), 1)
    res.json(getRegisteredCourse())
})

// Register a new course
app.post('/:courseid', function(req, res) {
    var courseId = req.params.courseid
    if (registeredCourses[currentUser].indexOf(courseId) < 0) {
        registeredCourses[currentUser].push(courseId)
    }
    res.json(getRegisteredCourse())
})

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000

app.listen(port, ip)
