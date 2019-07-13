// about controller

"use strict";

// TODO: check form inputs (chars and lenght etc.)

angular
  .module("myApp")
  .controller("homeController", function (
    $scope,
    $rootScope,
    $http,
    $window,
    $cookies
  ) {
    $rootScope.server = "http://localhost:3000/";


    $scope.points = [];
    $scope.btnCount = 0;
    $scope.invalidInput = false;
 

    var randomProperty = function (object) {
      var keys = Object.keys(object);
      var rand = Math.floor(keys.length * Math.random());
      return {
        key: keys[rand],
        value: object[keys[rand]]
      };
    };

    $scope.specificPOI = function (poiName) {
      let url = $rootScope.server + "getPointCritics/" + poiName;
      $http.get(url).then(
        function successCallback(response) {
          $scope.critics = response.data;
        })
        .then(function(){
        let url = $rootScope.server + "getPointProperties/" + poiName;
        $http.get(url).then(
          function successCallback(response) {
            let poiName = Object.keys(response.data)[0];
            $rootScope.poi = {
              name: poiName,
              img: $rootScope.allPOI[poiName][0],
              description: response.data[poiName][1],
              numOfViews: response.data[poiName][0],
              rank: response.data[poiName][2],
              critic1: $scope.critics[$scope.critics.length - 1],
              critic2: $scope.critics[$scope.critics.length - 2]
            };
            $rootScope.showPOI = true;
            if ($rootScope.connected) {
              $rootScope.showCritic = true
            }
            else {
              $rootScope.showCritic = false
            }
            let data = {
              interestPointName: $rootScope.poi.name,
              numOfViews: $rootScope.poi.numOfViews
            }
            url = $rootScope.server + 'increaseViews',
              $http.post(url, data).then(
              function successCallback(response) {console.log(response)});
            // $window.location.href = '#!sPOI';
            console.log("Moving to Detailes about " + poiName);
          },
          function errorCallback(response) {
            console.log("invalid POI");
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          }
        );
      });
    };

    $scope.logout = function () {
      $cookies.remove("token");
      $cookies.remove("user");
      $rootScope.connected = false;
      $rootScope.currentUser = "guest";
    };

    $scope.logIn = function () {
      let url = $rootScope.server + "login";

      let data = {
        userName: $scope.user_name,
        password: $scope.password
      };
      $http.post(url, data).then(
        function successCallback(response) {
          $rootScope.token = response.data;
          $cookies.put("token", $rootScope.token);
          $cookies.put("user", $scope.user_name);
          $rootScope.currentUser = $scope.user_name;
          $rootScope.connected = true;
          $window.location.href = "#!login";
          $scope.invalidInput = false;

        },
        function errorCallback(response) {
          $scope.invalidInput = true;
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        }
      );
    };
    if ($rootScope.popularPoints == null) {
      let url = $rootScope.server + "getRandomPopularPoints";
      $http.get(url).then(function successCallback(response) {
        $rootScope.popularPoints = response.data;
        $scope.points = {};
        while (Object.keys($scope.points).length < 3) {
          const point = randomProperty($rootScope.popularPoints);
          $scope.points[point["key"]] = point["value"];
        }

        console.log($scope.points);
      });
    } else {
      $scope.points = {};
      while (Object.keys($scope.points).length < 3) {
        const point = randomProperty($rootScope.popularPoints);
        $scope.points[point["key"]] = point["value"];
      }
    }
  });
