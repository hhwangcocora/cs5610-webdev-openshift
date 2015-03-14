#!/bin/env node

/**
 * Created by hhwang on 3/8/15.
 */


var rootpath = '/project'

var users = {
    lily: 123
}

exports.load = function(app, public_path) {

    // Index page
    app.get(rootpath, function (req, res) {
        res.sendfile(public_path + 'project/pomodoro.html')
    })

    // Login
    app.post(rootpath + '/userAccount/login', function(req, res) {
        console.log("User login with account " + req);
        var paramUsername = req.query.username
        var paramPassword = req.query.password
        var resp = {username: ''}

        if (paramUsername in users && users[paramUsername] == paramPassword) {
            resp['username'] = paramUsername
        }
        res.json(resp)
    })

    app.put(rootpath + '/addTask', function(req, res) {
        tasks.push(req.body)
        res.json(tasks)
    })
}




