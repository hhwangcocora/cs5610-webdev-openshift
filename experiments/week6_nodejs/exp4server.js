#!/bin/env node

/**
 * Created by hhwang on 3/1/15.
 */

var todoItems = [
    {'check':true, 'description':'This is an example todo text.'},
    {'check':false, 'description':'Use the check box to mark your todo task as done/undone.'},
    {'check':false, 'description':'Remove the task by clicking the close icon after the text.'}
]
var rootpath = '/week6exp4'

exports.load = function(app, public_path) {

    app.get(rootpath, function(req, res) {
        res.sendfile(public_path + 'experiments/week6_nodejs/exp4.html')
    })

    // get all to-do items
    app.get(rootpath + '/todoItems', function (req, res) {
        res.json(todoItems)
    })

    // add a new to-do item
    app.put(rootpath + '/add', function (req, res) {
        todoItems.push(req.body)
        res.json(todoItems)
    })

    // toggle a to-do item
    app.put(rootpath + '/toggle', function(req, res) {
        var descrip = req.body.description
        for(var idx in todoItems) {
            if (todoItems[idx].description === descrip) {
                todoItems[idx].check = !todoItems[idx].check
                break
            }
        }
        res.json(todoItems)
    })

    // delete a to-do item
    app.put(rootpath + '/delete', function(req, res) {
        console.log(req.body)
        var descrip = req.body.description
        for(var idx in todoItems) {
            if (todoItems[idx].description === descrip) {
                todoItems.splice(idx, 1)
                break
            }
        }
        res.json(todoItems)
    })
}




