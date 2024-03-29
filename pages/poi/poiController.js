// poi controller

"use strict";

angular.module("myApp")
    .controller("poiController", function ($scope, $window, $rootScope, $http, $cookies) {
        $scope.showFavourites = false;
        $scope.showSorted = false;

        if ($scope.categories == null) {
            $scope.categories = [];
            let url = $rootScope.server + 'getAllCategories';
            $http.get(url).then(function successCallback(response) {
                $scope.categories = response.data;
                $scope.getAllPoi();
                if ($rootScope.connected) {
                    $scope.getFavourites();
                }
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
            $scope.favourites = {};
            $scope.favouritePOI = [];
            $scope.positions = {};
            $scope.favNames = [];
            $http({
                method: 'GET',
                url: $scope.server + 'private/getUserFavouritePoints',
                headers: { 'x-auth-token': $rootScope.token }
            }).then((response) => {
                var favNames = Object.keys(response.data);
                $scope.favNames = favNames;
                for (let j = 0; j < favNames.length; j++) {
                    let name = favNames[j]
                    let pos = response.data[name][3] - 1;
                    $scope.positions[name] = pos + 1;
                    let i = Math.floor(pos / 5);
                    if ($scope.favouritePOI[i] == null) {
                        $scope.favouritePOI[i] = [];
                    }
                    $scope.favouritePOI[Math.floor(pos / 5)][pos % 5] = name;
                    if ($scope.favouritePOI[i].length == 5) {
                        i += 1;
                    }
                }
                for (let i in Object.keys($scope.poiNames)) {
                    if (favNames.includes($scope.poiNames[i])) {
                        $scope.favourites[$scope.poiNames[i]] = true;
                    }
                    else {
                        $scope.favourites[$scope.poiNames[i]] = false;
                    }
                }
            }).catch(function (error) {
                console.log(error)
            });
        }


        $scope.savePoint = (name) => {
            $scope.favourites[name] = true;
            $scope.favNames.push(name);
            if ($scope.favouritePOI.length == 0) {
                $scope.favouritePOI.push([]);
            }
            else if ($scope.favouritePOI[$scope.favouritePOI.length - 1].length == 5) {
                $scope.favouritePOI.push([]);
            }
            $scope.favouritePOI[$scope.favouritePOI.length - 1].push(name);
            let i = $scope.favouritePOI.length - 1;
            let j = $scope.favouritePOI[i].length - 1;
            $scope.positions[name] = i * 5 + j + 1;;

        }

        $scope.unSavePoint = (name) => {
            $scope.favourites[name] = false;
            let i = $scope.favNames.indexOf(name)
            $scope.favNames.splice(i, 1);
            // let j = 0;
            // let x = 0;
            // for (j = 0; j < $scope.poiNames.length; j++) {
            //     x = $scope.favouritePOI[j].indexOf(name);
            //     if (x != -1)
            //         break;
            // }
            // $scope.favouritePOI[j].splice(x, 1);
            // if ($scope.favouritePOI[j].length == 0) {
            //     $scope.favouritePOI.splice(j, 1);
            // }
            let pos = $scope.positions[name];
            delete $scope.positions[name];
            Object.keys($scope.positions).forEach(poiName => {
                if ($scope.positions[poiName] > pos) {
                    $scope.positions[poiName] -= 1;
                }
            });
            $scope.favouritePOI = [];
            for (let j = 0; j < $scope.favNames.length; j++) {
                let name = $scope.favNames[j]
                let postition = $scope.positions[name]-1;
                let i = Math.floor(postition / 5);
                if ($scope.favouritePOI[i] == null) {
                    $scope.favouritePOI[i] = [];
                }
                $scope.favouritePOI[Math.floor(postition / 5)][postition % 5] = name;
                if ($scope.favouritePOI[i].length == 5) {
                    i += 1;
                }
            }
        }

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
                            // $window.location.href = '#!sPOI';
                            console.log("Moving to Detailes about " + poiName);
                            let data = {
                                interestPointName: $rootScope.poi.name,
                                numOfViews: $rootScope.poi.numOfViews
                            }
                            url = $rootScope.server + 'increaseViews',
                                $http.post(url, data).then(
                                    function successCallback(response) { console.log(response) });

                        },
                        function errorCallback(response) {
                            console.log("invalid POI");
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        }
                    );
                });
        };

        $scope.savePoints = () => {
            let favs = []
            let names = Object.keys($scope.favourites)
            for (let name in $scope.favourites) {
                if ($scope.favourites[name])
                    favs.push(name)
            }
            // let data = {
            //     interestPointNames: favs,
            // }
            let data = {
                favPos: $scope.positions,
            }
            $http({
                method: 'POST',
                url: $rootScope.server + 'private/saveFavouritePoints',
                headers: { 'x-auth-token': $rootScope.token },
                data: data
            }).then((response) => {
                console.log(response);
            })
        }


        $scope.createPoi = () => {
            $scope.showCategory = {}
            for (const category in $scope.categories) {
                $scope.showCategory[category] = true;
            }
            $scope.poiCategories = [];
            $scope.positions = {};
            for (const category in $scope.categories) {
                let url = $scope.server + 'getCategoryPoints/' + category;
                $http.get(url).then((response) => {
                    $scope.poiCategories.push([category, Object.keys(response.data)]);
                },
                    (err) => {
                        console.log(err)
                    }
                )
            }


        }

        $scope.poiCritic = (poiName) => {
            $rootScope.poiName = poiName;
        }

        $scope.filterByCategory = function () {

            for (const category in $scope.categories) {
                if ($scope.categoryFilter == category || $scope.categoryFilter == null || $scope.categoryFilter == "") {
                    $scope.showCategory[category] = true;
                }
                else {
                    $scope.showCategory[category] = false;

                }
            }
        }

        $scope.sortedPoints = {};
        $scope.sort = function () {
            let i = 0
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

        $scope.updatePoiPos = (poiName) => {
            let pos = parseInt($scope.positions[poiName]) - 1;
            $scope.positions[poiName] = pos + 1;
            let temp = $scope.favouritePOI[Math.floor(pos / 5)][pos % 5];
            for (let i = 0; i < $scope.favouritePOI.length; i++) {
                for (let j = 0; j < $scope.favouritePOI[i].length; j++) {
                    if ($scope.favouritePOI[i][j] == poiName) {
                        $scope.favouritePOI[i][j] = temp;
                        $scope.positions[temp] = i * 5 + j + 1;
                        break;
                    }
                }
            }
            $scope.favouritePOI[Math.floor(pos / 5)][pos % 5] = poiName;
        }

    });