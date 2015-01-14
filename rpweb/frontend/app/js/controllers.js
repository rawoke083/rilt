

/**********************************************************************
 * Concept
 *********************************************************************/
 app.controller('ConceptCtrl',function($rootScope,$scope, $http, $route, $routeParams, UsrAuth) {
	
	$scope.concept= { feedback:""};
	$rootScope.cid = 0;
	
    $scope.getConcept 	= function(id){
		//alert("ccc");
		if(!id){
			
			if ($routeParams.id) {
				id =  $routeParams.id;
			}
		}//end id-check
		
		
		if (!id ) {
			return;
		}
		
		
		$http.get('/api/v1/concept/' + id).
		success(function(data, status, headers, config) {
			
			$scope.concept = data;
			$rootScope.cid = data.ID;
			
			
			
		}).
		error(function(data, status, headers, config) {
			// log error
			$scope.concept.feedback = data;
		});
		
		
		
	}; //end getConcept
	
	$scope.voteConcept = function(conceptId,voteDir){
		alert(conceptId);
		alert(voteDir);
		
		
		$http.post('/api/v1/concept/' + id).
		success(function(data, status, headers, config) {
			
			$scope.concept = data;
			
		}).
		error(function(data, status, headers, config) {
			// log error
			$scope.concept.feedback = data;
		});
		
		
		
	};
	

	$scope.updateConcept = function(concept) {
		
			
		// Simple POST request example (passing data) :
		$http.post('/api/v1/concept/', concept).
		success(function(data, status, headers, config) {
			
			// this callback will be called asynchronously
			// when the response is available
			$scope.concept.feedback = data.FlashMsg;
			$scope.concept.id = data.ID;
			
			$rootScope.cid = data.ID;
		
			
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
app.controller('RiltCtrl', function($rootScope,$scope, $http, $route, $routeParams,$sce, $location, UsrAuth) {
	
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
	$scope.getRiltsForConcept = function(conceptId,offset) {
		
		
		if(!conceptId){
			
			if ($routeParams.id) {
				conceptId =  $routeParams.id;				
			}
		}//end id-check
		
		
		
		$http.get('/api/v1/rilt/' + conceptId + "/" + offset).
		success(function(data, status, headers, config) {
			
			$scope.rilts = data;
			
			$scope.trustAsHtml = $sce.trustAsHtml;
			
		}).
		error(function(data, status, headers, config) {
			// log error
			alert(data)
		});
	}
	$scope.updateRilt = function(rilt) {
		rilt.type = parseInt(rilt.type);
		rilt.concept_id = parseInt($rootScope.cid);
		rilt.id = parseInt(rilt.id);
		
		// Simple POST request example (passing data) :
		$http.post('/api/v1/rilt/', rilt).
		success(function(data, status, headers, config) {
			// this callback will be called asynchronously
			// when the response is available
			$scope.feedback = data;
			rilt.id = data.ID;
			$location.path('/c/'+$rootScope.cid);
			
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
	
	
	$scope.InitRilt = function() {
		
	};
	
	
	$scope.InitRilt();
	
	
	
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
		
		$location.path('/');	
	
	}
	


	$scope.SignIn = function (){
		UsrAuth.logout();				
		$location.path('/usr/signin');	
		
	
	}
	
	
	//$scope.InitNav();
	 
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
