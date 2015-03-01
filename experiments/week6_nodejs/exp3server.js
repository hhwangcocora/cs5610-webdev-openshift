#!/bin/env node

/**
 * Created by hhwang on 2/25/15.
 */

// data
var registeredCourses = {
    bob: [1, 3],
    charlie: [2]
}

var users = {
    bob: 123456,
    charlie: 123456
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
var getRegisteredCourse = function(username) {
    var courseIds = registeredCourses[username]
    var result = []
    for (var idx in courseIds) {
        result.push(courses[courseIds[idx]])
    }
    return result

}

var rootpath = '/week6exp3'

exports.load = function(app, public_path) {

    app.get(rootpath, function(req, res) {
        res.sendfile(public_path + 'experiments/week6_nodejs/exp3.html')
    })


    // Get all courses
    app.get(rootpath + '/allCourses', function (req, res) {
        res.json(courses)
    })

    app.put(rootpath + '/login', function(req, res){
        console.log(req.query)
        var username = req.query.username
        var password = req.query.password

        if (username in users && users[username] == password) {
            res.json({
                username: username
            })
        } else {
            res.json({
                username: ''
            })
        }
    })

    // Get the user's registered courses
    app.get(rootpath + '/:username/registeredCourses', function (req, res) {
        var username = req.params.username
        res.json(getRegisteredCourse(username))
    })

    // Unregister a course
    app.delete(rootpath + '/:username/:courseid', function(req, res) {
        var courseId = req.params.courseid
        var username = req.params.username
        registeredCourses[username].splice(registeredCourses[username].indexOf(courseId), 1)
        res.json(getRegisteredCourse(username))
    })

    // Register a new course
    app.post(rootpath + '/:username/:courseid', function(req, res) {
        var courseId = req.params.courseid
        var username = req.params.username
        if (registeredCourses[username].indexOf(courseId) < 0) {
            registeredCourses[username].push(courseId)
        }
        res.json(getRegisteredCourse(username))
    })

    app.put(rootpath + '/register', function(req, res) {
        var username = req.query.username
        var password = req.query.password
        console.log(req.query)
        if (username in users) {
            res.json({
                username: ''
            })
        } else {
            users[username] = password
            registeredCourses[username] = []
            res.json({
                username: username
            })
        }
    })
}




