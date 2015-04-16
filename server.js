#!/bin/env node

/**
 * Created by hhwang on 2/25/15.
 */

var express = require('express')
var bodyParser = require('body-parser')
var multer = require('multer');
var mongoose = require('mongoose')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var cookieParser = require('cookie-parser')
var session = require('express-session')


var app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(session({secret: 'My secret'}))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

var public_path = __dirname + '/public/'
app.use(express.static(public_path))
var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/pomodoro'
mongoose.connect(connectionString)


/* IMPORT MODULES */
var db = require('./project/db.js')(mongoose)
app.use(db)
var auth = require('./project/auth.js')(passport, LocalStrategy, db)
app.use(auth)


/* ENDPOINTS */

rootpath = '/project'

app.get(rootpath + '/', function(req, res) {
    console.log('get pomodoro home page')
    res.sendfile(public_path + '/project/pomodoro.html')
})

/* user login, logout and register */

var printRequest = function(req) {
    console.log('user: ')
    console.log(req.user)
    console.log('query: ')
    console.log(req.query)
    console.log('body: ')
    console.log(req.body)
}

// ok
app.post(rootpath + '/userAccount/login', passport.authenticate('local'), function(req, res) {
    console.log('/userAccount/login')
    printRequest(req)
    db.getUserByName(req.query.username, function(user) {
        res.json(user)
    }, function(err) {
        res.json(err)
    })
})

// ok
app.post(rootpath + '/userAccount/logout', auth.auth, function(req, res) {
    console.log('/userAccount/logout')
    printRequest(req)
    req.logout()
    res.send(200)
})

// ok
app.get(rootpath + '/userAccount/loggedin', function(req, res) {
    console.log('/userAccount/loggedin')
    printRequest(req)
    res.send(req.isAuthenticated() ? req.user : '0');
})

// ok
app.post(rootpath + '/userAccount/register', function(req, res) {
    console.log('/userAccount/register')
    printRequest(req)
    var paramUsername = req.query.username
    var paramPassword = req.query.password
    var resp = {username: ''}

    db.addNewUser(paramUsername, paramPassword, function(newUser) {
        resp['username'] = paramUsername
        res.json(resp)
    }, function(error) {
        resp['message'] = 'Account already registered.'
        res.json(resp)
    })
})

// ok
app.get(rootpath + '/users/', auth.auth, function(req, res) {
    // User can query all other users' account info
    // don't leak sensative info here
    printRequest(req)
    db.getUserList(function(users) {
        res.json(users)
    }, function(err) {
        res.json({message: 'Failed'})
    })
})

/* projects */

// ok  (filters are not tested)
app.get(rootpath + '/projects/', auth.auth, function(req, res) {
    // owner = userid, contributor = userid
    console.log('/projects/')
    printRequest(req)
    var paramOwner = ''
    var paramContributor = ''
    if (req.query.hasOwnProperty('owner')) {
        paramOwner = req.query.owner
        db.getProjectByContributor(paramOwner, function(projects) {
            res.json(projects)
        }, function(err) {
            res.json({message: 'Failed'})
        })
    } else if (req.query.hasOwnProperty('contributor')) {
        paramContributor = req.query.contributor
        db.getProjectByContributor(paramContributor, function(projects) {
            res.json(projects)
        }, function(err) {
            res.json({message: 'Failed'})
        })
    } else {
        db.getProjectList(function (projects) {
            res.json(projects)
        }, function (err) {
            res.json({message: 'Failed'})
        })
    }
})

// ok
app.post(rootpath + '/projects/add', auth.auth, function(req, res) {
    console.log('/projects/add')
    printRequest(req)
    var project = req.body
    db.addNewProject(project.name, project.description, project.picUrl, req.user.id, function(newProject) {
        res.json(newProject)
    }, function(err) {
        res.json({message: 'Failed'})
    })
})

app.post(rootpath + '/projects/drop', auth.auth, function(req, res) {
    // projectid
    console.log('Drop project ')
    printRequest(req)
    var projectid = req.query.projectid
    var userid = req.user.id
    db.dropProject(projectid, userid, function(newProject) {
        res.json(newProject)
    }, function(err) {
        res.json({message: 'Failed'})
    })

})

app.post(rootpath + '/projects/join', auth.auth, function(req, res) {
    // projectid
    printRequest(req)
    console.log('Join to project' + req.request)
    var projectid = req.query.projectid
    var userid = req.user.id
    db.joinProject(projectid, userid, function(newProject) {
        res.json(newProject)
    }, function(err) {
        res.json({message: 'Failed'})
    })
})

/* Task */

app.get(rootpath + '/tasks/', auth.auth, function(req, res) {
    printRequest(req)
})

/* START LISTENING ON THE PORT */

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000

app.listen(port, ip)
