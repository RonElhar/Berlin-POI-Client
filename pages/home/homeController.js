// about controller

"use strict";

// TODO: check form inputs (chars and lenght etc.)

angular.module("myApp")
    .controller("homeController", function ($scope, $rootScope, $http, $window, $cookies) {
        $rootScope.server = "http://localhost:3000/";

        // $scope.user_name = "ron";
        // $scope.password = "123456";

        $scope.points = [];
        $scope.btnCount = 0;
        $scope.invalidInput = false;
        // var objectKeysShuffled = function (object) {
        //     return shuffle(Object.keys(object));
        // };

        var randomProperty = function (object) {
            var keys = Object.keys(object);
            var rand = Math.floor(keys.length * Math.random());
            return {
                'key': keys[rand],
                'value': object[keys[rand]]
            };
        };

        $scope.specificPOI = function (poiName) {
            let url = $rootScope.server + 'getPointProperties/' + poiName;
            $http.get(url)
                .then(function successCallback(response) {
                    $rootScope.poi = {
                        name: response.data.key,
                        img: $scope.points[response.data.key],
                        description: response.data.value[1],
                        numOfViews: response.data.value[0]
                    };
                    $rootScope.showPOI = true;
                    // $window.location.href = '#!sPOI';
                    console.log("Moving to Detailes about " + poiName);
                }, function errorCallback(response) {
                    console.log("invalid POI");
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        $scope.logout = function () {
            $cookies.remove("token");
            $cookies.remove("user");
            $rootScope.connected = false;
            $rootScope.currentUser = "guest";
        }

        $scope.logIn = function () {
            let url = $rootScope.server + 'login';

            let data = {
                userName: $scope.user_name,
                password: $scope.password
            };
            $http.post(url, data)
                .then(function successCallback(response) {
                    $rootScope.token = response.data;
                    $cookies.put("token", $rootScope.token);
                    $cookies.put("user", $scope.user_name);
                    $rootScope.currentUser = $scope.user_name;
                    $rootScope.connected = true;
                    $window.location.href = '#!login';
                    $scope.invalidInput = false;

                    // $location.url('#!login')


                }, function errorCallback(response) {
                    $scope.invalidInput = true;
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });

        };
        if ($rootScope.popularPoints == null) {
            let url = $rootScope.server + 'getRandomPopularPoints';
            $http.get(url).then(function successCallback(response) {
                $rootScope.popularPoints = response.data
                $scope.points = {}
                while (Object.keys($scope.points).length < 3) {
                    const point = randomProperty($rootScope.popularPoints);
                    $scope.points[point['key']] = point['value'];
                }

                console.log($scope.points)
            });
        } else {
            $scope.points = {}
            while (Object.keys($scope.points).length < 3) {
                const point = randomProperty($rootScope.popularPoints);
                $scope.points[point['key']] = point['value'];
            }
        }


    })
    ;




