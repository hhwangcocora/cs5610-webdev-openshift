
/* Mongoose */

var userSchema = ''  // User Schema
var User = ''  // User Model
var projectSchema = '' // Project Schema
var Project = '' // Project Model
var taskSchema = '' // Task Schema
var Task = '' // Task Model
var metaSchema = '' // Meta Schema
var Meta = '' // Meta Model

var userIdCounter = 0
var projectIdCounter = 0
var taskIdCounter = 0

var init = function(mongoose) {
    // User
    userSchema = mongoose.Schema({
        id: Number,
        username: String,
        firstName: String,
        lastName: String,
        password: String,
        email: String,
        gender: String,
        picUrl: String,
        contributedProjects: [Number],
        ownedProjects: [Number]
    })
    User = mongoose.model('User', userSchema)

    // Project
    projectSchema = mongoose.Schema({
        id: Number,
        name: String,
        description: String,
        picUrl: String,
        tasks: [Number],
        contributors: [Number],
        owner: Number
    })
    Project = mongoose.model('Project', projectSchema)

    // Task
    taskSchema = mongoose.Schema({
        id: Number,
        name: String,
        description: String,
        project: Number,
        records: [{user: Number, startTime: Date, endTime: Date, totalSeconds: Number}],
        owner: Number,
        totalSeconds: Number,
        completed: Boolean
    })
    Task = mongoose.model('Task', taskSchema)

    // Meta
    metaSchema = mongoose.Schema({
        userIdCounter: Number,
        projectIdCounter: Number,
        taskIdCounter: Number
    })
    Meta = mongoose.model('Meta', metaSchema)

    // Initialize all counters
    Meta.findOne({}, function(err, meta) {
        if (meta) {

            userIdCounter = meta.userIdCounter
            projectIdCounter = meta.projectIdCounter
            taskIdCounter = meta.taskIdCounter

        } else {
            console.log('create new meta')
            var newMeta = new Meta({
                userIdCounter: 0,
                projectIdCounter: 0,
                taskIdCounter: 0
            })
            newMeta.save()
        }
    })

}

var saveMeta = function() {
    Meta.findOne({}, function(err, meta) {

                meta.userIdCounter = userIdCounter
                meta.projectIdCounter = projectIdCounter
                meta.taskIdCounter = taskIdCounter
                meta.save()


    })
}

/* User */

var getUserByName = function(uname, successHandler, errorHandler) {
    console.log(uname)
    var query = User.where({username: uname})
    query.findOne(function (err, user) {
        if (user) {
            successHandler(user)
        } else {
            console.log(err)
            errorHandler(err)
        }
    })
}

var getUserById = function(userid, successHandler, errorHandler) {
    var query = User.where({id: userid})
    query.findOne(function (err, user) {
        if (user) {
            successHandler(user)
        } else {
            console.log(err)
            errorHandler(err)
        }
    })
}

var getUserList = function(successHandler, errorHandler) {
    User.find({}, function(err, users) {
        if (users) {
            var result = {}
            users.forEach(function(user) {
                result[user.id] = {
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    gender: user.gender,
                    picUrl: user.picUrl,
                    contributedProjects: user.contributedProjects,
                    ownedProjects: user.ownedProjects
                }
            })
            successHandler(result)
        } else {
            errorHandler(err)
        }
    })
}

var addNewUser = function(username, password, successHandler, errorHandler) {
    getUserByName(username, function(user) {
        // user already exists
        errorHandler('User already exists')
    }, function(error) {
        var newUser = new User({
            id: userIdCounter,
            username: username,
            firstName: '',
            lastName: '',
            password: password,
            email: '',
            gender: '',
            picUrl: '',
            contributedProjects: [],
            ownedProjects: []
        })
        userIdCounter++
        saveMeta()
        newUser.save(function (err) {
            if (err) {
                errorHandler(err)
            } else {
                successHandler(newUser)
            }
        })
    })
}

var updateUser = function(userid, u, successHandler, errorHandler) {
    getUserById(userid, function(user) {
        user.firstName = u.firstName
        user.lastName = u.lastName
        user.password = u.password
        user.email = u.email
        user.gender = u.gender
        user.picUrl = u.picUrl
        user.save()
        successHandler(user)
    }, function(err) {
        errorHandler(err)
    })
}

/* Project */


var getProjectList = function(successHandler, errorHandler) {
    Project.find({}, function(err, projects) {
        if (projects) {
            var result = {}
            projects.forEach(function(project) {
                result[project.id] = project
            })
            successHandler(result)
        } else {
            errorHandler(err)
        }
    })
}

var getProjectByOwner = function(userid, successHandler, errorHandler) {
    Project.find({owner: userid}, function(err, projects) {
        if (projects) {
            var result = {}
            projects.forEach(function(project) {
                result[project.id] = project
            })
            successHandler(result)
        } else {
            errorHandler(err)
        }
    })
}

var getProjectByContributor = function(userid, successHandler, errorHandler) {
    Project.find({contributors: {'$in' : [userid]}}, function(err, projects) {
        if (projects) {
            var result = {}
            projects.forEach(function(project) {
                result[project.id] = project
            })
            successHandler(result)
        } else {
            errorHandler(err)
        }
    })
}

var getProjectByName = function(pname, successHandler, errorHandler) {
    var query = Project.where({name: pname})
    query.findOne(function (err, project) {
        if (project) {
            successHandler(project)
        } else {
            console.log(err)
            errorHandler(err)
        }
    })
}

var getProjectById = function(pid, successHandler, errorHandler) {
    var query = Project.where({id: pid})
    query.findOne(function (err, project) {
        if (project) {
            successHandler(project)
        } else {
            console.log(err)
            errorHandler(err)
        }
    })
}

var addNewProject = function(pname, description, picUrl, owner, successHandler, errorHandler) {
    getProjectByName(pname, function(user) {
        // project already exists
        errorHandler('Project already exists')
    }, function(error) {
        var newProject = new Project({
            id: projectIdCounter,
            name: pname,
            description: description,
            picUrl: picUrl,
            tasks: [],
            contributors: [],
            owner: owner
        })
        projectIdCounter++
        saveMeta()
        newProject.save(function (err) {
            if (err) {
                errorHandler(err)
            } else {
                // put the project to the ower's owned projects
                getUserById(owner, function(user) {
                    user.ownedProjects.push(newProject.id)
                    user.save()
                }, function(err) {
                    errorHandler(err)
                })
                successHandler(newProject)
            }
        })
    })
}

var joinProject = function(projectid, userid, successHandler, errorHandler) {
    getProjectById(projectid, function(project) {
        var idx = project.contributors.indexOf(userid)
        if (idx <= 0) {
            project.contributors.push(userid)
            project.save()
        }
        getUserById(userid, function(user) {
            var idx2 = user.contributedProjects.indexOf(project.id)
            if (idx2 <= 0) {
                user.contributedProjects.push(projectid)
                user.save()
            }
            successHandler(project)
        }, function(err) {
            console.log(err)
            errorHandler(err)
        })
    }, function(err) {
        console.log(err)
        errorHandler(err)
    })

}

var dropProject = function(projectid, userid, successHandler, errorHandler) {
    getProjectById(projectid, function(project) {
        var idx = project.contributors.indexOf(userid)
        if (idx > -1) {
            project.contributors.splice(idx, 1)
            project.save()
            getUserById(userid, function(user) {
                var idx2 = user.contributedProjects.indexOf(project.id)
                if (idx2 > -1) {
                    user.contributedProjects.splice(idx2, 1)
                    user.save()
                }
            }, function(err) {
                //errorHandler(err)
            })
        }
        successHandler(project)
    }, function(err) {
        errorHandler(err)
    })
}

/* Task */

var getTaskByProject = function(pid, successHandler, errorHandler) {
    Task.find({project: pid}, function(err, tasks) {
        if (tasks) {
            var result = {}
            tasks.forEach(function(task) {
                result[task.id] = task
            })
            successHandler(tasks)
        } else {
            console.log(err)
            errorHandler(err)
        }
    })
}

var getTaskById = function(tid, successHandler, errorHandler) {
    var query = Task.where({id: tid})
    query.findOne(function (err, task) {
        if (task) {
            successHandler(task)
        } else {
            console.log(err)
            errorHandler(err)
        }
    })
}

var getTaskByName = function(tname, successHandler, errorHandler) {
    var query = Task.where({name: tname})
    query.findOne(function (err, task) {
        if (task) {
            successHandler(task)
        } else {
            console.log(err)
            errorHandler(err)
        }
    })
}

var addNewTask = function(tname, description, project, successHandler, errorHandler) {
    getTaskByName(tname, function(task) {
        errorHandler('Task already exists')
    }, function(error) {
        var newTask = new Task({
            id: taskIdCounter,
            name: tname,
            description: description,
            project: project,
            records: [],
            owner: '',
            totalHours: 0,
            completed: false
        })
        taskIdCounter++
        saveMeta()
        newTask.save(function (err) {
            if (err) {
                errorHandler(err)
            } else {
                successHandler(newTask)
            }
        })
    })
}

var addNewRecord = function(tid, user, startTime, endTime, totalSeconds, successHandler, errorHandler) {
    Task.update({id: tid},
        {$push: {user: user, startTime: startTime, endTime: endTime, totalSeconds: totalSeconds}},
        {upsert: true},
        function(err, task) {
            if (task) {
                task.totalSeconds += totalSeconds
                task.save()
                successHandler(task)
            } else {
                errorHandler(err)
            }
    })
}

var ownTask = function(taskid, userid, successHandler, errorHandler) {
    getTaskById(taskid, function(task) {
        task.owner = userid
        task.save()
        successHandler(task)
    }, function(err) {
        errorHandler(err)
    })
}

var dropTask = function(taskid, userid, successHandler, errorHandler) {
    getTaskById(taskid, function(task) {
        task.owner = ''
        task.save()
        successHandler(task)
    }, function(err) {
        errorHandler(err)
    })
}

var completeTask = function(taskid, successHandler, errorHandler) {
    getTaskById(taskid, function(task) {
        task.completed = true
        task.save()
        successHandler(task)
    }, function(err) {
        errorHandler(err)
    })
}

module.exports = function(mongoose) {
    init(mongoose)
    return {
        getUserList: getUserList,
        getUserById: getUserById,
        getUserByName: getUserByName,
        addNewUser: addNewUser,
        updateUser: updateUser,

        getProjectList: getProjectList,
        getProjectById: getProjectById,
        getProjectByName: getProjectByName,
        getProjectByOwner: getProjectByOwner,
        getProjectByContributor: getProjectByContributor,
        addNewProject: addNewProject,
        joinProject: joinProject,
        dropProject: dropProject,

        getTaskById: getTaskById,
        getTaskByName: getTaskByName,
        getTaskByProject: getTaskByProject,
        addNewTask: addNewTask,
        addNewRecord: addNewRecord,
        ownTask: ownTask,
        dropTask: dropTask,
        completeTask: completeTask
    }
}