function AppCtrl ($scope) {
    'use strict';
    $scope.title = 'The Movie Database';
}

function WelcomeCtrl ($scope, moviesResponse) {
    'use strict';
    $scope.movies = moviesResponse.data;
    $scope.reverse = false;
    $scope.toggle = function() {
        $scope.reverse = !$scope.reverse;
    }
}

function MoviesListCtrl ($scope, $location, moviesResponse) {
    'use strict';
    $scope.movies = moviesResponse.data;
    $scope.reverse=false;
    $scope.toggle = function() {
        $scope.reverse = !$scope.reverse;
    }
    $scope.add = function () {
        $location.path('/movies/new');
    };
}

MoviesListCtrl.resolve = {
    moviesResponse: function ($http) {
        'use strict';
        return $http.get('/movies');
    }
};

function MoviesAddCtrl ($scope, $http, $location) {
    'use strict';
    $scope.movie = {};
    $scope.save = function (movie) {
        $http.post('/movies', movie)
        .success(function(res) {
            $location.path('/movies/' + res.id);
        });
    };
}

function MovieDetailCtrl ($scope, $http, $location, moviesResponse) {
    'use strict';
    $scope.movie = moviesResponse.data;

    $scope['delete'] = function () {
        $http['delete']('/movies/' + $scope.movie.id).success(function (res) {
            $location.path('/movies');
        });
    };
}

function movieDetailResolver ($http, $route) {
    'use strict';
    var id = $route.current.params.id;
    return $http.get('/movies/' + id);
}

MovieDetailCtrl.resolve = {
    moviesResponse: movieDetailResolver
};

function MovieEditCtrl ($scope, $http, $location, moviesResponse) {
    'use strict';
    $scope.movie = moviesResponse.data;

    $scope.save = function () {
        $http.put('/movies/' + $scope.movie.id, $scope.movie)
        .success(function (res) {
            $location.path('/movies/' + $scope.movie.id);
        });
    };
}

MovieEditCtrl.resolve = {
    moviesResponse: movieDetailResolver
};

function ActorsListCtrl ($scope, $location, actorsResponse) {
    'use strict';
    $scope.actors = actorsResponse.data;
//    $scope.add = function () {
//        $location.path('/movies/new');
//    };
}

ActorsListCtrl.resolve = {
    actorsResponse: function ($http) {
        'use strict';
        return $http.get('/actors');
    }
};

function ActorsAddCtrl ($scope, $http, $location) {
    'use strict';
    $scope.actor = {};
    $scope.save = function (actor) {
        $http.post('/actors', actor)
        .success(function(res) {
            //$location.path('/actors/' + res.id);
            $location.path('/actors');
        });
    };
}

function ActorDetailCtrl ($scope, $http, $location, actorsResponse) {
    'use strict';
    $scope.actor = actorsResponse.data;

    $scope['delete'] = function () {
        $http['delete']('/actors/' + $scope.actor.id).success(function (res) {
            $location.path('/actors');
        });
    };
}

function actorDetailResolver ($http, $route) {
    'use strict';
    var id = $route.current.params.id;
    return $http.get('/actors/' + id);
}

ActorDetailCtrl.resolve = {
    actorsResponse: actorDetailResolver
};

function ActorEditCtrl ($scope, $http, $location, actorsResponse) {
    'use strict';
    $scope.actor = actorsResponse.data;

    $scope.save = function () {
        $http.put('/actors/' + $scope.actor.id, $scope.actor)
        .success(function (res) {
            $location.path('/actors/' + $scope.actor.id);
        });
    };
}

ActorEditCtrl.resolve = {
    actorsResponse: actorDetailResolver
};

function NotFoundCtrl ($scope, $location) {
    'use strict';
    $scope.culprit = $location.search().culprit || 'unknown beast';
}

var ErrorCtrl = NotFoundCtrl;
