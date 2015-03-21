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

    var register = function(username, password) {
        var url = rootpath + '/userAccount/register?username=' + username + '&password=' + password
        return postRequest(url, {})
    }

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
        addTask: addTask,
        getTasks: getTasks,
        updateTags: updateTags,
        getTags: getTags
    }
})