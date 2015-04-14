#!/bin/env node

/**
 * Created by hhwang on 3/8/15.
 */

var rootpath = '/project'




/* Authentication */

var initPassport = function(passport, LocalStrategy) {
    passport.use(new LocalStrategy( function(username, password, done ) {
        dbFindByName(username, function(user) {
                if (user.password == password) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Authentication failed'})
                }
            }, function(error) {
                return done(null, false, {message: 'User not exists'})
            })
    }))
    // serialize and deserialize the user to/from the session
    passport.serializeUser(function(user, done) {
        done(null, user)
    })
    passport.deserializeUser(function(user, done) {
        done(null, user)
    });
}

var auth = function(req, res, next) {
    if (!req.isAuthenticated())
        res.send({message: 'Authentication failed'})
    else
        next()
}


/* Endpoints */

exports.load = function(app, public_path, mongoose, passport, LocalStrategy) {

    initMongo(mongoose)
    initPassport(passport, LocalStrategy)

    dbAddUser('admin', '123', function(user){}, function(error){})

    // Index page
    app.get(rootpath, function (req, res) {
        res.sendfile(public_path + 'project/pomodoro.html')
    })



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




