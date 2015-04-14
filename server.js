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

/* INDEX */

app.get('/', function(req, res) {
    res.sendfile(public_path + 'project/pomodoro.html')
})

/* LOGIN LOGOUT REGISTER */

app.post(rootpath + '/userAccount/login', passport.authenticate('local'), function(req, res) {
    res.json({username: req.query.username})
})

app.post(rootpath + '/userAccount/logout', auth, function(req, res) {
    req.logout()
    res.send(200)
})

app.get(rootpath + '/userAccount/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
})

app.post(rootpath + '/userAccount/register', function(req, res) {
    console.log("User register with account " + req.query);
    var paramUsername = req.query.username
    var paramPassword = req.query.password
    var resp = {username: ''}

    dbAddUser(paramUsername, paramPassword, function(newUser) {
        resp['username'] = paramUsername
        res.json(resp)
    }, function(error) {
        resp['message'] = 'Account already registered.'
        res.json(resp)
    })
})




var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000

app.listen(port, ip)
