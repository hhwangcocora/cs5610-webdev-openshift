#!/bin/env node

/**
 * Created by hhwang on 3/8/15.
 */


var rootpath = '/project'

var users = {
    admin: 123
}

var userSchema = ''  // Schema
var User = ''  //Model

var initMongo = function(mongoose) {
    // Create mongo db model
    userSchema = mongoose.Schema({
        username: String,
        password: String,
        tasks:[{
            l1Tag: String,
            l2Tag: String,
            startTime: Date,
            stopTime: Date,
            duration: {hours: Number, minutes: Number, seconds: Number},
            totalSeconds: Number
        }],
        tags: [{
            tagName: String,
            subTags: [String]
        }]
    })

    User = mongoose.model('User', userSchema)
}

var dbFindByName = function(uname, callback, errorHandler) {
    var query = User.where({username: uname})
    query.findOne(function (err, user) {  // This call is asynchronous, so response inside the callback function
        if (user) {
            callback(user)
        } else {
            console.log(err)
            errorHandler(err)
        }
    })
}

var dbAddUser = function(username, password, callback, errorHandler) {
    dbFindByName(username, function(user) {
        // user already exists
        errorHandler('User already exists')
    }, function(error) {
        var newUser = new User({
            username: username,
            password: password,
            tasks: [],
            tags: [
                { tagName: 'web', subTags: ['experiment', 'project', 'course']},
                { tagName: 'ir', subTags: ['homework1', 'homework2']},
                { tagName: 'mapreduce', subTags: ['assignment1', 'assginment2', 'project', 'paper reading']},
                { tagName: 'others', subTags: ['other']}
            ]
        })
        newUser.save(function (err) {
            if (err) {
                errorHandler(err)
            } else {
                callback(newUser)
            }
        })
    })
}

exports.load = function(app, public_path, mongoose) {

    initMongo(mongoose)

    dbAddUser('admin', '123', function(user){}, function(error){})

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

        dbFindByName(paramUsername,
            function(user) { // This call is asynchronous, so response inside the callback function
                if (user._doc.password == paramPassword) {
                    resp.username = paramUsername
                }
                res.json(resp)
            }, function(error) {
                res.json(resp)
            })
    })

    // Register
    app.put(rootpath + '/userAccount/register', function(req, res) {
        console.log("User register with account " + req.query);
        var paramUsername = req.query.username
        var paramPassword = req.query.password
        var resp = {username: ''}

        dbAddUser(paramUsername, paramPassword, function(newUser) {
            resp['username'] = paramUsername
            res.json(resp)
        }, function(error) {
            resp['errorMsg'] = 'Account already registered.'
            res.json(resp)
        })
    })
}




