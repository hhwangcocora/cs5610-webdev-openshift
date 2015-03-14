/**
 * Created by hhwang on 3/14/15.
 */

app.factory('httpService', function($http, $q){

    var rootpath = '/project'

    var login = function(username, password) {
        var deferred = $q.defer();
        var url = rootpath + '/userAccount/login?username=' + username + '&password=' + password;
        $.post(url).success(function(resp, status){
            deferred.resolve(resp)
        }).fail(function(resp, status){
            deferred.reject(resp)
        })
        return deferred.promise;
    }


    return { // Expose the services
        rootPath: rootpath,
        login: login
    }
})