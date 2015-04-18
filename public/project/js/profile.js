/**
 * Created by hhwang on 4/13/15.
 */
app.controller('profileController', function ($scope, httpService) {

    var controller = this;
    
    controller.defaultProfileUrl = '../img/default-profile-pic.png'

    var setDisplayPic = function () {
        if ($scope.currentUser.picUrl && $scope.currentUser.picUrl.length > 0) {
            controller.displayProfilePic = $scope.currentUser.picUrl
        } else {
            controller.displayProfilePic = controller.defaultProfileUrl
        }
    }

    setDisplayPic()
    this.reset = { password: '', password2: '', oldpassword: ''}
    console.log($scope.currentUser)


    var copyProfile = function () {
        return {
            firstName: $scope.currentUser.firstName,
            lastName: $scope.currentUser.lastName,
            email: $scope.currentUser.email,
            gender: $scope.currentUser.gender,
            picUrl: $scope.currentUser.picUrl
        }
    }

    this.originalProfile = copyProfile()


    this.profileUpdated = function () {
        return $scope.currentUser.firstName != controller.originalProfile.firstName
            || $scope.currentUser.lastName != controller.originalProfile.lastName
            || $scope.currentUser.email != controller.originalProfile.email
            || $scope.currentUser.gender != controller.originalProfile.gender
            || $scope.currentUser.picUrl != controller.originalProfile.picUrl
    }

    this.saveProfile = function () {
        httpService.updateUser($scope.currentUser).then(function(resp) {
            controller.originalProfile = copyProfile()
            setDisplayPic()
        }, function(resp) {
            $scope.errorMessage = resp.message
        })
    }

    this.restoreProfile = function() {
        $scope.currentUser.firstName = this.originalProfile.firstName
        $scope.currentUser.lastName = this.originalProfile.lastName
        $scope.currentUser.email = this.originalProfile.email
        $scope.currentUser.gender = this.originalProfile.gender
        $scope.currentUser.picUrl = this.originalProfile.picUrl
    }

    this.passwordChanged = function() {
        return this.reset.password.length > 0 && this.reset.password2.length > 0 && this.reset.oldpassword > 0
    }

    this.resetPassword = function() {
        if (this.reset.oldpassword === $scope.currentUser.password) {
            if (this.reset.password === this.reset.password2 && this.reset.password.length >= 6) {
                $scope.currentUser.password = this.reset.password
                console.log('to reset password')
                this.saveProfile()
            } else {
                console.log('password not valid')
                $scope.errorMessage = 'Password not valid. It should be at least 6 characters and the two passwords be same.'
            }
        } else {
            console.log('password not math with old one')
            $scope.errorMessage = 'Password not match with original one'
        }
        this.reset = { password: '', password2: '', oldpassword: ''}
    }

})