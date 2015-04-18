/**
 * Created by hhwang on 4/13/15.
 */
app.controller('usersController', function($scope, $routeParams, httpService) {
    $scope.userid = $routeParams.id

    var controller = this
    controller.getAllUserIds = function() {
        var result = []
        for (var u in $scope.allUsers) {
            result.push(u)
        }
        console.log(result)
        return result
    }

    httpService.getUserList().then(function(resp) {
        if (resp) {
            $scope.allUsers = resp
            $scope.allUserIds = controller.getAllUserIds()
            $scope.currentUser = $scope.allUsers[$scope.currentUserId]
        } else {
            console.log('getUserList failed')
            $scope.allUsers = {}
        }
    }, function(resp) {
        console.log('getUserList failed')
        $scope.allUsers = {}
        $scope.errorMessage = resp.message
    })



    this.getDisplayPic = function(userid) {
        if ($scope.allUsers[userid].picUrl && $scope.allUsers[userid].picUrl.length > 0) {
            return $scope.allUsers[userid].picUrl
        } else {
            return '../img/default-profile-pic.png'
        }
    }

})