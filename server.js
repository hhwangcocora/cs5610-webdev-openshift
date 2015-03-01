#!/bin/env node

/**
 * Created by hhwang on 2/25/15.
 */

var express = require('express')
var bodyParser = require('body-parser')
var multer = require('multer');
var app = express()
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

var public_path = __dirname + '/public/'
app.use(express.static(public_path))


/**
 * Load all the modules
 */

var week6exp1 = require('./experiments/week6_nodejs/exp1server.js')
var week6exp2 = require('./experiments/week6_nodejs/exp2server.js')

week6exp1.load(app, public_path)
week6exp2.load(app, public_path)


app.get('/', function(req, res) {
    res.sendfile(public_path + 'index.html')
})

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000

app.listen(port, ip)
