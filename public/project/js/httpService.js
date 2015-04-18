/**
 * Created by hhwang on 3/14/15.
 */

app.factory('httpService', function($http, $q){

    var rootpath = '/project'

    var postRequest = function(url, body) {
        var deferred = $q.defer();
        $http.post(url, body).success(function(resp, status){
            if (resp.message) {
                deferred.reject(resp)
            } else {
                deferred.resolve(resp)
            }
        }).error(function(resp, status){
            deferred.reject({message: resp})
        })
        return deferred.promise;
    }
    var getRequest = function(url) {
        var deferred = $q.defer();
        $http.get(url).success(function(resp, status){
            if (resp.message) {
                deferred.reject(resp)
            } else {
                deferred.resolve(resp)
            }
        }).error(function(resp, status){
            deferred.reject(resp)
        })
        return deferred.promise;
    }


    /* Login and Logout */

    var login = function(username, password) {
        var url = rootpath + '/userAccount/login?username=' + username + '&password=' + password
        return postRequest(url, {})
    }

    var loggedin = function() {
        var url = rootpath + '/userAccount/loggedin'
        return getRequest(url)
    }

    var logout = function() {
        var url = rootpath + '/userAccount/logout'
        return postRequest(url)
    }


    /* Register */

    var register = function(username, password) {
        var url = rootpath + '/userAccount/register?username=' + username + '&password=' + password
        return postRequest(url, {})
    }

    /* User */

    var updateUser = function(user) {
        return postRequest(rootpath + '/userAccount/update', user)
    }

    var getUserList = function() {
        return getRequest(rootpath + '/users/')
    }


    /* Projects */

    var getProjectList = function(owner, contributor) {
        var url = rootpath + '/projects/'
        if (owner) {
            url += '?owner=' + owner
        } else if (contributor) {
            url += '?contributor=' + contributor
        }
        return getRequest(url)
    }

    var addProject = function(project) {
        var url = rootpath + '/projects/add/'
        return postRequest(url, project)
    }

    var joinProject = function(pid) {
        return postRequest(rootpath + '/projects/join?projectid=' + pid, {})
    }

    var dropProject = function(pid) {
        return postRequest(rootpath + '/projects/drop?projectid=' + pid, {})
    }
    /* Updates */


    /* Tasks */

    var getTaskByProject = function(pid) {
        return getRequest(rootpath + '/tasks?projectid=' + pid)
    }

    var addTask = function(task) { // name, description, project
        return postRequest(rootpath + '/tasks/add', task)
    }

    var ownTask = function(tid) {
        return postRequest(rootpath + '/tasks/own?taskid=' + tid, {})
    }

    var dropTask = function(tid) {
        return postRequest(rootpath + '/tasks/drop?taskid=' + tid, {})
    }

    var completeTask = function(tid) {
        return postRequest(rootpath + '/tasks/complete?taskid=' + tid, {})
    }

    var addNewRecord = function(record) { // task, startTime, endTime, totalSeconds
        return postRequest(rootpath + '/tasks/addRecord', record)
    }

    var getTags = function() {
        return getRequest(rootpath + '/tasks/tags')
    }

    return { // Expose the services
        rootPath: rootpath,
        login: login,
        loggedin: loggedin,
        logout: logout,
        register: register,
        updateUser: updateUser,
        getUserList: getUserList,

        getProjectList: getProjectList,
        addProject: addProject,
        joinProject: joinProject,
        dropProject: dropProject,

        getTaskByProject: getTaskByProject,
        addTask: addTask,
        ownTask: ownTask,
        dropTask: dropTask,
        completeTask: completeTask,
        addNewRecord: addNewRecord,

        getTags: getTags

    }
})