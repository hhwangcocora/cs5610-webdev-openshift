#!/bin/env node

/**
 * Created by hhwang on 2/25/15.
 */

var express = require('express')
var bodyParser = require('body-parser')
var multer = require('multer');
var mongoose = require('mongoose')

var app = express()
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

var public_path = __dirname + '/public/'
app.use(express.static(public_path))


var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/pomodoro'
mongoose.connect(connectionString)


/**
 * Load all the modules
 */

var week6exp1 = require('./experiments/week6_nodejs/exp1server.js')
var week6exp2 = require('./experiments/week6_nodejs/exp2server.js')
var week6exp3 = require('./experiments/week6_nodejs/exp3server.js')
var week6exp4 = require('./experiments/week6_nodejs/exp4server.js')
var week6exp5 = require('./experiments/week6_nodejs/exp5server.js')
var project = require('./project/serverPomodoro.js')

week6exp1.load(app, public_path)
week6exp2.load(app, public_path)
week6exp3.load(app, public_path)
week6exp4.load(app, public_path)
week6exp5.load(app, public_path)
project.load(app, public_path, mongoose)


app.get('/', function(req, res) {
    res.sendfile(public_path + 'index.html')
})

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000

app.listen(port, ip)
