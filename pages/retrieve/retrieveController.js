
"use strict";

angular.module("myApp")
    .controller("retrieveController", function ($scope, $window, $http, $rootScope) {
        $scope.invalidUser = false;
        $scope.invalidAnswer = false;
        $scope.retreiveQuestions = () => {
            if ($scope.userName == "" || $scope.userName == null) {
                $scope.invalidUser = true;
                return;
            }
            let data = {
                userName: $scope.userName,
            }
            $http({
                method: 'POST',
                url: $rootScope.server + 'retrievePasswordQuestion',
                data: data
            }).then((response) => {
                $scope.questions = response.data;
                console.log(response);
            }).catch((error) => {
                $scope.invalidUser = true;
                console.log("invalid user");
            })

        }

        $scope.retrievePassword = () => {
            if ($scope.verificationAnswer == "" || $scope.verificationAnswer == null) {
                $scope.invalidAnswer = true;
                return;
            }
            let data = {
                userName: $scope.userName,
                question: $scope.selectedQ,
                answer: $scope.verificationAnswer
            }
            $http({
                method: 'POST',
                url: $rootScope.server + 'retrievePassword',
                data: data
            }).then((response) => {
                $scope.password = response.data;
                console.log(response);
            }).catch((error)=>{
                $scope.invalidAnswer = true
                console.log(invalidAnswer);
            })
        }


    });