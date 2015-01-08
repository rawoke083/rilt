

/**********************************************************************
 * Concept
 *********************************************************************/
 app.controller('ConceptCtrl',function($scope, $http, $route, $routeParams, UsrAuth) {

	$scope.updateConcept = function(concept) {
		
			
		// Simple POST request example (passing data) :
		$http.post('/api/v1/concept/', concept).
		success(function(data, status, headers, config) {
			
			// this callback will be called asynchronously
			// when the response is available
			$scope.concept.feedback = data.FlashMsg;
			$scope.concept.id = data.ID;
		
			
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			
			$scope.feedback = data;
			
		});
	}; //updateRilt END 
	
 });
 
/***********************************************************************
 * Rilt
 **********************************************************************/
app.controller('RiltCtrl', function($scope, $http, $route, $routeParams, UsrAuth) {
	// $scope.isAuth = UsrAuth.isAuthenticated;
	$scope.init_sn = function() {
		$('.summernote').summernote();
	}
	$scope.getRiltLatest = function() {
		$http.get('/api/v1/rilt/latest').
		success(function(data, status, headers, config) {
			$scope.rilts = data;
		}).
		error(function(data, status, headers, config) {
			// log error
			alert(data)
		});
	}
	$scope.getRilt = function(id) {
		$http.get('/api/v1/concept/' + id).
		success(function(data, status, headers, config) {
			
			$scope.rilt = data;
			
		}).
		error(function(data, status, headers, config) {
			// log error
			alert(data)
		});
	}
	$scope.updateRilt = function(rilt) {
		rilt.type = parseInt(rilt.type);
		rilt.concept_id = parseInt(rilt.concept_id);
		
		// Simple POST request example (passing data) :
		$http.post('/api/v1/rilt/', rilt).
		success(function(data, status, headers, config) {
			// this callback will be called asynchronously
			// when the response is available
			$scope.feedback = data;
			
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			$scope.feedback = data;
		});
	}; //updateRilt END 
	if ($routeParams.riltId) {
		$scope.getRilt($routeParams.riltId);
	}
});


/********************************************************************
 * NavCtrl Controller 		NavCtrl Controller			NavCtrl Controller
 ********************************************************************/
app.controller('NavCtrl', function($rootScope, $scope, $http, $route, $routeParams, $location, $window, UsrAuth) {
	$scope.Nav = {
		Email: UsrAuth.getEmail(),
		IsLoggedIn : UsrAuth.isAuthenticated()
	};

	$scope.InitNav = function (){
		$scope.Nav.Email =  UsrAuth.getEmail();
		$scope.Nav.IsLoggedIn =  UsrAuth.isAuthenticated();
		
		
	}
	
	
	$scope.SignOut = function (){
		UsrAuth.logout();		
		$scope.InitNav();
		$location.path('/');	
	
	}
	


	$scope.SignIn = function (){
		UsrAuth.logout();		
		$scope.InitNav();
		$location.path('/usr/signin');	
	
	}
	
	
	$scope.InitNav();
	 
});


/********************************************************************
 * User Controller 		User Controller			User Controller
 ********************************************************************/
app.controller('UsrCtrl', function($rootScope, $scope, $http, $route, $routeParams, $location, $window, UsrAuth) {

	$scope.Usr = {
		feedback:""
	};
	
	
	$scope.registerUsr = function(usr) {
		// Simple POST request example (passing data) :
		usr.password = usr.passwd1;
		$http.post('/api/v1/usr/', usr).
		success(function(data, status, headers, config) {
			// this callback will be called asynchronously
			// when the response is available    
			$scope.feedback = data;
		}).
		error(function(data, status, headers, config) {
			$scope.feedback = " ERRROR" + data;
		});
	}; //registerUsr END 
	

	$scope.signInUsr = function(usr) {
			UsrAuth.login(usr).then(function(response) {
					
				$location.path('/');
			
			}, function(err) {
				$scope.Usr.feedback="Login Failed";
			});
		
	}; //signInUsr END 
	
	
	
});
