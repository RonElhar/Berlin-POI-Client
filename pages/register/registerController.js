// about controller

"use strict";



angular.module("myApp")
    .controller("registerController", function ($scope, $rootScope, $http) {
        // button click count
        $rootScope.server = "http://localhost:3000/";
        $scope.questions = ["What is your childhood nickname?", "What is your childhood address?", "In which college did you study?", "What is your favourite food?"]
        if ($scope.categories == null) {
            $scope.categories = [];
            let url = $scope.server + 'getAllCategories';
            $http.get(url).then(function successCallback(response) {
                $scope.categories = response.data;
            });
        }


        if ($scope.countries == null) {
            $scope.countries = [];
            let url = $rootScope.server + 'getCountries';
            $http.get(url).then(function successCallback(response) {
                for (let i = 0; i < response.data.length; i++) {
                    $scope.countries.push(response.data[i]["Name"][0]);
                }
            });
        }
        //userName, password, firstName, lastName, city, country, email, interestCategories, verificationQuestion[], verificationAnswer[]
        $scope.register = function () {
            let url = $rootScope.server + 'register';
            
            let data = {
                userName: $scope.regUserName,
                password: $scope.password,
                firstName: $scope.regFirstName,
                lastName: $scope.regLastName,
                city: $scope.regCity,
                country: $scope.regCountry,
                email: $scope.email,
                interestCategories: [$scope.regCategories, $scope.regCategories2, $scope.regCategories3],
                verificationQuestion: [$scope.regVerQuestions, $scope.regVerQuestions2],
                verificationAnswer: [$scope.regVerQuestions, $scope.regVerQuestions2]
            };
            const dataKeys = Object.keys(data);
            for(let i = 0; i< dataKeys.length;i++){
                if (data[dataKeys[i]] == null){
                    $scope.invalidArguments = true
                    console.log("invalid "+dataKeys[i]+": " + data[dataKeys[i]] )
                    return;
                }
            }
            $http.post(url, data)
                .then(function successCallback(response) {

                    $window.location.href = '#!home';


                }, function errorCallback(response) {
                    console.log("Registration failed user_name already exists")
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });

        };

    });
