#!/bin/env node

/**
 * Created by hhwang on 3/8/15.
 */


var rootpath = '/project'

exports.load = function(app, public_path) {

    app.get(rootpath, function (req, res) {
        res.sendfile(public_path + 'project/pomodora.html')
    })

    app.get(rootpath + '/tasks', function(req, res) {
        res.json(tasks)
    })

    app.put(rootpath + '/addTask', function(req, res) {
        tasks.push(req.body)
        res.json(tasks)
    })
}




