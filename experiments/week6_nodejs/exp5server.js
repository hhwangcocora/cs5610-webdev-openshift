#!/bin/env node

/**
 * Created by hhwang on 3/1/15.
 */

var tasks = []
var rootpath = '/week6exp5'

exports.load = function(app, public_path) {

    app.get(rootpath, function (req, res) {
        res.sendfile(public_path + 'experiments/week6_nodejs/exp5.html')
    })

    app.get(rootpath + '/tasks', function(req, res) {
        res.json(tasks)
    })

    app.put(rootpath + '/addTask', function(req, res) {
        tasks.push(req.body)
        res.json(tasks)
    })
}




