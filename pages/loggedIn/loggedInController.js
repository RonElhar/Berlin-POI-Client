// poi controller

"use strict";

angular.module("myApp")
    .controller("loggedInController", function ($scope, $window, $http,$rootScope) {


        $scope.getFavourites = () => {
            $scope.favourites = {}
            $http({
                method: 'GET',
                url: $scope.server + 'private/getLastSavedPoints',
                headers: { 'x-auth-token': $rootScope.token }
            }).then((response) => {
                $scope.favourites = response.data;

            });
        }

        $scope.getRecommended = () => {
            $scope.recommended = {}
            $http({
                method: 'GET',
                url: $scope.server + 'private/getRecommendedPoints',
                headers: { 'x-auth-token': $rootScope.token }
            }).then((response) => {
                let i=0;
                let names = Object.keys(response.data)
                $scope.favourites.length= {};
                while($scope.favourites.length<2){
                    $scope.favourites[names[i]] = response.data[names[i]];
                }
            });
        }

        $scope.getRecommended();
        $scope.getFavourites();


        $scope.changePage = function(){
            $window.location.href = "../index.html";
        };
    
    });