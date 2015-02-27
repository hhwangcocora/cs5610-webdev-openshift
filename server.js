#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var app = express()

app.get('/', function (req, res) {
    res.send('hello')
})

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000

app.listen(port, ip)


