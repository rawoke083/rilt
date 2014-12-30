var app = angular.module('riltApp', ['ngRoute', 'summernote']);


app.factory('TokenInterceptor', function($q, $window, $location) {
	return {
		request: function(config) {
			config.headers = config.headers || {};
			if ($window.localStorage.access_token) {
				config.headers.AccessToken = $window.localStorage.access_token;
			}
			return config;
		},
		requestError: function(rejection) {
			return $q.reject(rejection);
		},
		/* Set Authentication.isAuthenticated to true if 200 received */
		response: function(response) {
			if (response != null && response.status == 200 && $window.localStorage.access_token) {
				//set aut=1   
			}
			return response || $q.when(response);
		},
		/* Revoke client authentication if 401 is received */
		responseError: function(rejection) {
			if (rejection != null && rejection.status === 401 && ($window.localStorage.access_token)) {
				delete $window.localStorage.access_token;
				//AuthenticationService.isAuthenticated = false;
				$location.path("/usr/sigin");
			}
			return $q.reject(rejection);
		}
	};
});




var loginRequired = function($location, $q,UsrAuth) {  
    var deferred = $q.defer();

    if(! UsrAuth.isAuthenticated()) {
        deferred.reject()
        $location.path('/usr/signin');
    } else {
        deferred.resolve()
    }

    return deferred.promise;
}


app.config(function configure($routeProvider, $locationProvider,$httpProvider) {
	
	$httpProvider.interceptors.push('TokenInterceptor');
	
	
	$routeProvider.
		//when('/', { controller: 'RiltCtrl', templateUrl: './views/home.html' }).
	when('/rilt/new', {
		templateUrl: './views/rilt.form.html',
		controller: 'RiltCtrl',
		resolve: { loginRequired: loginRequired }
		
	}).
	when('/rilt/feeds/:feedtype', {
		templateUrl: './views/rilt.html',
		controller: 'RiltCtrl'
	}).
	when('/rilt/:riltId', {
		templateUrl: './views/rilt.view.html',
		controller: 'RiltCtrl'
	}).
	when('/usr/signup', {
		templateUrl: './views/usr.reg.form.html',
		controller: 'UsrCtrl'
	}).
	when('/usr/signin', {
		templateUrl: './views/usr.login.form.html',
		controller: 'UsrCtrl'
	}).
	otherwise({
		redirect: '/'
	});
	$locationProvider.html5Mode(true);
	
	
	
});

app.run(function($window, UsrAuth) {
	
	if ($window.localStorage.access_token && $window.localStorage.access_token.length) {
		UsrAuth.init($window.localStorage.email, $window.localStorage.id, $window.localStorage.access_token);
	}
});


