// poi controller

"use strict";

angular.module("myApp")
    .controller("poiController", function ($scope, $window, $rootScope, $http, $cookies) {
        if ($scope.categories == null) {
            $scope.categories = [];
            let url = $rootScope.server + 'getAllCategories';
            $http.get(url).then(function successCallback(response) {
                $scope.categories = response.data;
                $scope.getAllPoi();
                $scope.getFavourites();
                $scope.createPoi();
            });
        }
        $scope.getAllPoi = () => {
            let url = $scope.server + 'getAllPoints/';
            $scope.sortedByRank = []
            $http.get(url).then((response) => {
                $scope.allPOI = response.data;
                $scope.showSorted = false;
                for (const pointName in $scope.allPOI) {
                    $scope.sortedByRank.push([pointName, $scope.allPOI[pointName][2]]);
                }
                function compare(a, b) {
                    if (a[1] > b[1]) {
                        return -1;
                    }
                    if (a[1] < b[1]) {
                        return 1;
                    }
                    return 0;
                }
                $scope.poiNames = Object.keys($scope.allPOI);
                $scope.sortedByRank = $scope.sortedByRank.sort(compare);


            });
        }

        $scope.getFavourites = () => {
            $scope.favourites = {}
            $http({
                method: 'GET',
                url: $scope.server + 'private/getUserFavouritePoints',
                headers: { 'x-auth-token': $rootScope.token }
            }).then((response) => {
                var favNames = Object.keys(response.data);
                for (let i in Object.keys($scope.poiNames))
                    if (favNames.includes($scope.poiNames[i])) {
                        $scope.favourites[$scope.poiNames[i]] = true;
                    }
                    else {
                        $scope.favourites[$scope.poiNames[i]] = false;
                    }
            });
        }

        $scope.savePoint = (name) => {
            $scope.favourites[name] = true;
        }

        $scope.unSavePoint = (name) => {
            $scope.favourites[name] = false;
        }

        $scope.savePoints = () => {

        }


        $scope.createPoi = () => {

            if ($scope.poiCategories == null) {
                $scope.poiCategories = {};
                for (const category in $scope.categories) {
                    let url = $scope.server + 'getCategoryPoints/' + category;
                    $http.get(url).then((response) => {
                        $scope.poiCategories[category] = Object.keys(response.data);
                    },
                        (err) => {
                            var x = 1;
                            console.log(err)
                        }
                    )
                };
            }

            $scope.showCategory = {}
            for (const category in $scope.categories) {
                $scope.showCategory[category] = true;
            }
        }


        $scope.filterByCategory = function () {
            $scope.showCategory
            for (const category in $scope.categories) {
                if ($scope.categoryFilter == category || $scope.categoryFilter == "") {
                    $scope.showCategory[category] = true;
                }
                else {
                    $scope.showCategory[category] = false;

                }
            }
        }

        $scope.sortedPoints = {};
        $scope.sort = function () {
            let i = 1
            for (let j = 0; j < $scope.sortedByRank.length; j++) {
                let name = $scope.sortedByRank[j][0]
                if ($scope.sortedPoints[i] == null) {
                    $scope.sortedPoints[i] = [];
                }
                let temp = {}
                $scope.sortedPoints[i].push(name);

                if ($scope.sortedPoints[i].length == 5) {
                    i += 1;
                }
            }
            $scope.showSorted = true;
        }


    });