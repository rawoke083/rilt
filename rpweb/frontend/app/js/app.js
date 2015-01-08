var app = angular.module('riltApp', ['ngRoute', 'summernote']);





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
		templateUrl: './views/concept.form.html',
		controller: 'ConceptCtrl',
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
	
		//UsrAuth.isStillOk();
	
	}
});


