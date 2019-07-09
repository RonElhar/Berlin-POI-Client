'use strict';

let app;
app = angular.module('myApp', ["ngRoute", "ngCookies"]);
// var guest = true;
// export var userToken = null;
// config routes
app.config(function ($routeProvider) {
    $routeProvider
        // homepage
        .when('/', {
            templateUrl: 'pages/home/home.html',
            controller: 'homeController as hm'

        })
        // about
        .when('/about', {
            templateUrl: 'pages/about/about.html',
            controller: 'aboutController as abtCtrl'
        })
        // poi
        .when('/poi', {
            templateUrl: 'pages/poi/poi.html',
            controller: 'poiController as poiCtrl'
        })

        .when('/register', {
            templateUrl: 'pages/register/register.html',
            controller: 'registerController',
        })

        .when('/login', {
            templateUrl: 'pages/loggedIn/loggedIn.html',
            controller: 'loggedInController',
        })

        .when('/retrieve', {
            templateUrl: 'pages/retrieve/retrieve.html',
            controller: 'retrieveController',
        })

        // .when('/sPOI', {
        //     templateUrl: 'pages/specificPOI/specificPOI.html',
        //     controller: 'specificPOIController',
        // })

        .when('/favorites', {
            templateUrl: 'pages/favorites/favorites.html',
            controller: 'favoritesController',
        })

        // other
        .otherwise({ redirectTo: '/' });
});

app.controller("mainController", function ($scope, $window, $rootScope, $http, $cookies) {
    $rootScope.server = "http://localhost:3000/";
    $scope.showSorted = false;
    const tokenCookie = $cookies.get("token");
    const user_nameCookie = $cookies.get("user")
    if (tokenCookie != null) {
        $rootScope.currentUser = user_nameCookie;
        $rootScope.token = tokenCookie;
        $rootScope.connected = true;
    }
    else{
        $rootScope.currentUser = "guest";
        $rootScope.connected = false;

    }
});

angular.module("myApp")
    .controller("specificPOIController", function ($scope,$rootScope, $window) {
        // console.log($rootScope.poi);
        $scope.changePage = function(){
            $window.location.href = "../index.html";
        };
    });

app.filter('searchFilter', function () {
    return function (arr, searchString) {
        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            if (item.toLowerCase().includes(searchString)) {
                result.push(item);
            }

        });

        return result;
    };

})
app.filter('searchCategoryPoi', function () {
    return function (dict, searchString) {
        console.log(searchString)
        if (!searchString) {
            return dict;
        }

        var result = {};

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(Object.keys(dict), function (item) {

            if (item.toLowerCase().includes(searchString)) {
                result[item] = dict[item];
            }

        });

        return result;
    };

})
