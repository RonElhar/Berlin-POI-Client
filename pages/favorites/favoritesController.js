// about controller

"use strict";

angular.module("myApp")
    .controller("favoritesController", function ($scope) {
        let self = this;
        self.museumsPoints = {
            1: {
                name: "p1",
                image: "https://media-cdn.tripadvisor.com/media/photo-s/0d/f5/7c/f2/eiffel-tower-priority.jpg"
            },
            2: {
                name: "p2",
                image: "https://cdni.rt.com/files/2017.12/article/5a3fe04efc7e93cd698b4567.jpg"
            },
            3: {
                name: "p3",
                image: "http://www.ukguide.co.il/Photos/England/London/British-Royal-Tour.jpg"
            }
        };
        self.nightPoints = {
            1: {
                name: "p1",
                image: "https://media-cdn.tripadvisor.com/media/photo-s/0d/f5/7c/f2/eiffel-tower-priority.jpg"
            }
        };
        self.restaurantsPoints = {
            1: {
                name: "p1",
                image: "https://media-cdn.tripadvisor.com/media/photo-s/0d/f5/7c/f2/eiffel-tower-priority.jpg"
            },
            2: {
                name: "p2",
                image: "https://cdni.rt.com/files/2017.12/article/5a3fe04efc7e93cd698b4567.jpg"
            }
        };

    });