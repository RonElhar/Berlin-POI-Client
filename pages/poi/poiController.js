// poi controller

"use strict";

angular.module("myApp")
    .controller("poiController", function ($scope, $window, $rootScope, $http, $cookies) {
        $scope.showFavourites = false;

        if ($scope.categories == null) {
            $scope.categories = [];
            let url = $rootScope.server + 'getAllCategories';
            $http.get(url).then(function successCallback(response) {
                $scope.categories = response.data;
                $scope.getPositions();
                $scope.getAllPoi();
                if ($rootScope.connected) {
                    $scope.getFavourites();
                }
                $scope.createPoi();
            });
        }
        $scope.getPositions = () => {
            $scope.categoriesPointsPositions = $cookies.categoriesPointsPositions

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
                                numOfViews: response.data[poiName][3],
                                numOfViews: response.data[poiName][4],
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
                            // $window.location.href = '#!sPOI';
                            console.log("Moving to Detailes about " + poiName);
                            let data = {
                                interestPointName: $rootScope.poi.name,
                                numOfViews: $rootScope.poi.numOfViews
                              }
                              url = $rootScope.server + 'increaseViews',
                                $http.post(url, data).then(
                                function successCallback(response) {console.log(response)});
                           
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
            let data = {
                interestPointNames: favs,
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
            // if($scope.categoriesPointsPositions == null)
            $scope.poiCategories = [];
            let i = 0;
            if($cookies.get("positions")!=null){
                $scope.positions =JSON.parse($cookies.get("positions"));
            }
            if ($scope.positions == null) {
                $scope.positions = {};
                for (const category in $scope.categories) {
                    let url = $scope.server + 'getCategoryPoints/' + category;
                    $http.get(url).then((response) => {
                        $scope.poiCategories.push([category, Object.keys(response.data)]);
                        $scope.positions[category] = i;
                        // $scope.poiCategories[i][1][0] is point name
                        for (let j = 0; j < Object.keys(response.data).length; j++) {
                            $scope.positions[$scope.poiCategories[i][1][j]] = j;
                        }
                        i += 1;
                    },
                        (err) => {
                            console.log(err)
                        }
                    )

                };
                $cookies.put("positions", JSON.stringify ($scope.positions));
            }
            else{
                for (const category in $scope.categories) {
                    let url = $scope.server + 'getCategoryPoints/' + category;
                    $http.get(url).then((response) => {
                        let catPos =  $scope.positions[category];
                        let names = Object.keys(response.data);
                        let points=[];
                        for(let i=0; i<names.length;i++){
                            let poiPos =  $scope.positions[names[i]];
                            points[poiPos] = names[i]
                        }
                        $scope.poiCategories[catPos] = [category, points];
                    },
                        (err) => {
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

        $scope.updatePoiPos = (category, poiName) => {
            let pos = parseInt($scope.positions[poiName]);
            $scope.positions[poiName] = pos;

            for (let i = 0; i < $scope.poiCategories.length; i++) {
                if ($scope.poiCategories[i][0] == category) {
                    let temp = $scope.poiCategories[i][1][pos];
                    if (temp == poiName) {
                        return;
                    }
                    for (let j = 0; j < $scope.poiCategories[i][1].length; j++) {
                        if ($scope.poiCategories[i][1][j] == poiName) {
                            $scope.poiCategories[i][1][j] = temp;
                            $scope.positions[temp] = j;

                        }
                    }
                    $scope.poiCategories[i][1][pos] = poiName;
                }
            }

            $cookies.put("positions", JSON.stringify( $scope.positions));

        }

        $scope.updateCatPos = (category) => {
            let pos = $scope.positions[category];
            let temp = $scope.poiCategories[pos][0];
            for (let i = 0; i < $scope.poiCategories.length; i++) {
                if ($scope.poiCategories[i][0] == category) {
                    $scope.poiCategories[i][0] = temp
                    $scope.positions[temp] = i;

                }
                $scope.poiCategories[pos][0] = category;

            }
            $cookies.put("positions", JSON.stringify( $scope.positions));

        }
    });