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

    var addTask = function(task) {
        var url = rootpath + '/tasks/add'
        return postRequest(url, task)
    }

    var getTasks = function() {
        var url = rootpath + '/tasks/get'
        return getRequest(url)
    }

    var updateTags = function(tags) {
        var url = rootpath + '/tags/update'
        return postRequest(url, tags)
    }

    var getTags = function() {
        var url = rootpath + '/tags/get'
        return getRequest(url)
    }

    return { // Expose the services
        rootPath: rootpath,
        login: login,
        loggedin: loggedin,
        logout: logout,
        register: register,
        getUserList: getUserList,

        getProjectList: getProjectList,
        addProject: addProject,
        joinProject: joinProject,
        dropProject: dropProject,


        addTask: addTask,
        getTasks: getTasks,
        updateTags: updateTags,
        getTags: getTags
    }
})