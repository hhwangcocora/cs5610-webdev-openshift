/**
 * Created by hhwang on 3/14/15.
 */

app.factory('httpService', function($http, $q){

    var rootpath = '/project'

    var putRequest = function(url, body) {
        var deferred = $q.defer();
        $http.put(url, body).success(function(resp, status){
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
        return putRequest(url, {})
    }

    var register = function(username, password) {
        var url = rootpath + '/userAccount/register?username=' + username + '&password=' + password
        return putRequest(url, {})
    }

    var addTask = function(task) {
        var url = rootpath + '/tasks/add'
        return putRequest(url, task)
    }

    return { // Expose the services
        rootPath: rootpath,
        login: login,
        register: register,
        addTask: addTask
    }
})