// poi controller

"use strict";

angular.module("myApp")
    .controller("specificPOIController", function ($scope,$rootScope, $window) {
        console.log($rootScope.poi);
        $rootScope.poi;
        $scope.changePage = function(){
            $window.location.href = "../index.html";
        };
    });