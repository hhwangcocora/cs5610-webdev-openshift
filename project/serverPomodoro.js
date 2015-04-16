#!/bin/env node

/**
 * Created by hhwang on 3/8/15.
 */

var rootpath = '/project'







/* Endpoints */

exports.load = function(app, public_path, mongoose, passport, LocalStrategy) {




    // Add task
    app.post(rootpath + '/tasks/add', auth, function(req, res) {
        dbFindByName(req.user.username, function(user) {
            user.tasks.push(req.body)
            user.save()
            res.json(req.body)
        }, function(error) {
            res.json({message: 'Add task failed with error ' + error})
        })
    })

    // Get tasks
    app.get(rootpath + '/tasks/get', auth, function(req, res) {
        dbFindByName(req.user.username, function(user) {
            res.json(user.tasks)
        }, function(error) {
            res.json({message: 'Get tasks failed with error ' + error})
        })
    })

    // Update a user's tags
    app.post(rootpath + '/tags/update', auth, function(req, res) {
        dbFindByName(req.user.username, function(user) {
            console.log(req.body)
            user.tags = req.body
            user.save()
            res.json(req.body)
        }, function(error) {
            res.json({message: 'Update tags failed with error ' + error})
        })
    })

    // Get tags
    app.get(rootpath + '/tags/get', auth, function(req, res) {
        dbFindByName(req.user.username, function(user) {
            res.json(user.tags)
        }, function(error) {
            res.json({message: 'Get tags failed with error ' + error})
        })
    })
}




