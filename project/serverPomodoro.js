#!/bin/env node

/**
 * Created by hhwang on 3/8/15.
 */


var rootpath = '/project'

var users = {
    admin: 123
}

exports.load = function(app, public_path) {

    // Index page
    app.get(rootpath, function (req, res) {
        res.sendfile(public_path + 'project/pomodoro.html')
    })

    // Login
    app.put(rootpath + '/userAccount/login', function(req, res) {
        console.log("User login with account " + req);
        var paramUsername = req.query.username
        var paramPassword = req.query.password
        var resp = {username: ''}

        if (paramUsername in users && users[paramUsername] == paramPassword) {
            resp['username'] = paramUsername
        }
        res.json(resp)
    })

    // Register
    app.put(rootpath + '/userAccount/register', function(req, res) {
        console.log("User register with account " + req.query);
        var paramUsername = req.query.username
        var paramPassword = req.query.password
        var resp = {username: ''}

        if (paramUsername in users) {
            resp['errorMsg'] = 'Account already registered.'
        } else {
            users[paramUsername] = paramPassword
            resp['username'] = paramUsername
        }
        res.json(resp)
    })
}




