// poi controller

"use strict";

angular
  .module("myApp")
  .controller("loggedInController", function (
    $scope,
    $window,
    $http,
    $rootScope
  ) {
    $scope.noLastSave = false;
    $scope.getRecommended = () => {
      $scope.recommended = {};
      $http({
        method: "GET",
        url: $scope.server + "private/getRecommendedPoints",
        headers: {
          "x-auth-token": $rootScope.token
        }
      }).then(response => {
        let i = 0;
        let names = Object.keys(response.data);
        if (names.length == 0) {
          $scope.noLastSaved = true
        }
        while (i < 2 && i < names.length) {
          $scope.recommended[names[i]] = response.data[names[i]];
          i += 1;
        }
      });
    };

    $scope.specificPOI = function (poiName) {
      let url = $rootScope.server + "getPointCritics/" + poiName;
      $http.get(url).then(
        function successCallback(response) {
          $scope.critics = response.data;
        })
        .then(function () {
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
                critic1: $scope.critics[0],
                critic2: $scope.critics[1]
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
                  function successCallback(response) { console.log(response) });
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

    $scope.getFavourites = () => {
      $scope.favourites = {};
      $http({
        method: "GET",
        url: $scope.server + "private/getLastSavedPoints",
        headers: { "x-auth-token": $rootScope.token }
      }).then(response => {
        $scope.favourites = response.data;
      });
    };
    $scope.getFavourites();
    $scope.getRecommended();

    $scope.changePage = function () {
      $window.location.href = "../index.html";
    };
  });
