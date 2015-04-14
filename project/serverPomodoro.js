#!/bin/env node

/**
 * Created by hhwang on 3/8/15.
 */


var rootpath = '/project'


/* Mongoose */

var userSchema = ''  // User Schema
var User = ''  // User Model
var projectSchema = '' // Project Schema
var Project = '' // Project Model
var taskSchema = '' // Task Schema
var Task = '' // Task Model
var recordSchema = '' // Work Record Schema
var Record = '' // Work Record Model

var initMongo = function(mongoose) {
    // Create mongo db model
    userSchema = mongoose.Schema({
        userName: String,
        firstName: String,
        lastName: String,
        password: String,
        email: String,
        gender: String
    })

    User = mongoose.model('User', userSchema)
}

var dbFindByName = function(uname, callback, errorHandler) {
    var query = User.where({username: uname})
    query.findOne(function (err, user) {  // This call is asynchronous, so response inside the callback function
        if (user) {
            callback(user)
        } else {
            console.log(err)
            errorHandler(err)
        }
    })
}

var dbAddUser = function(username, password, callback, errorHandler) {
    dbFindByName(username, function(user) {
        // user already exists
        errorHandler('User already exists')
    }, function(error) {
        var newUser = new User({
            username: username,
            password: password,
            tasks: [],
            tags: [  // predefined tags
                { tagName: 'web', subTags: ['experiment', 'project', 'course']},
                { tagName: 'ir', subTags: ['homework1', 'homework2']},
                { tagName: 'mapreduce', subTags: ['assignment1', 'assginment2', 'project', 'paper reading']},
                { tagName: 'others', subTags: ['other']}
            ]
        })
        newUser.save(function (err) {
            if (err) {
                errorHandler(err)
            } else {
                callback(newUser)
            }
        })
    })
}


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

    // Login
    app.post(rootpath + '/userAccount/login', passport.authenticate('local'), function(req, res) {
        res.json({username: req.query.username})
    })

    // Logout
    app.post(rootpath + '/userAccount/logout', auth, function(req, res) {
        req.logout()
        res.send(200)
    })

    // Loggedin
    app.get(rootpath + '/userAccount/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    })

    // Register
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




