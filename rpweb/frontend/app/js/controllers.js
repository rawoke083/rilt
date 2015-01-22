


/********************************************************************
 * NavCtrl Controller 		NavCtrl Controller			NavCtrl Controller
 ********************************************************************/
app.controller('NavCtrl', function($rootScope, $scope, $http, $route, $routeParams, $location, $window, UsrAuth,SearchService) {
	$scope.Nav = {
		Email: UsrAuth.getEmail(),
		IsLoggedIn : UsrAuth.isAuthenticated(),
		Term : SearchService.getTerm()
		
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
	
	$scope.doSearch = function(term){
		//alert($rootScope.search.searchTerm);
		$location.path('/search/'+$scope.Nav.Term);	
		
	}
	
	//$scope.InitNav();
	 
});

/**********************************************************************
 * SearchCtrl
 *********************************************************************/
 app.controller('SearchCtrl',function($rootScope,$scope, $http, $route, $routeParams, SearchService) {
	
	
	$scope.sitems = [];
	$scope.term = "";
	
	$scope.goSearch = function(term){
		
		if(!term){
			
			if ($routeParams.term) {
				term =  $routeParams.term;
			}
			
		}//end term-check
		
		
		
		SearchService.doSearch(term).then(function(response) {		
				$scope.sitems = SearchService.getResults();
				$scope.term = SearchService.getTerm();
				
			}, function(err) {
				alert("No results");
			});
		
		
		
		
		
	}//end term
	
	
	$scope.goSearch();
	
 });
 
/**********************************************************************
 * Concept
 *********************************************************************/
 app.controller('ConceptCtrl',function($rootScope,$scope, $http, $route, $routeParams, UsrAuth) {
	
	$scope.concept= { feedback:""};
	$rootScope.cid = 0;
	
	$scope.concepts = {trending:0};
	
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
	
	
	$scope.getTrendPopular=function(){
	
		
		
		var url = "api/v1/concept/feed/trending";
		
		$http.get(url).
		success(function(data, status, headers, config) {
			
			$scope.concepts.trending = data;	
			
			
		}).
		error(function(data, status, headers, config) {
			// log error
			$scope.concept.feedback = data;
		});
	
	};//end - getTrendPopular
	
	
 });
 
/***********************************************************************
 * Rilt
 **********************************************************************/
app.controller('RiltCtrl', function($rootScope,$scope, $http, $route, $routeParams,$sce, $location, UsrAuth) {
	
	$rootScope.rc = {rilts:0};		
	$scope.rc.addupdateText="";
	$scope.rc.rilt = 0;
	$scope.rc.offset = 0;
	

	$scope.getRiltLatest = function() {
		$http.get('/api/v1/rilt/latest').
		success(function(data, status, headers, config) {
			$scope.rc.rilts = data;
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
			
			$rootScope.rc.rilts = data;
			
			$rootScope.trustAsHtml = $sce.trustAsHtml;
			
		}).
		error(function(data, status, headers, config) {
			// log error
			alert(data)
		});
	}
	$scope.updateRilt = function(rilt) {
		rilt.type 		= rilt.type;
		rilt.concept_id = $rootScope.cid;
		rilt.id 		= rilt.id;
		
		
		$scope.rc.rilt = rilt;
		
		$http.post('/api/v1/rilt/', rilt).
		success(function(data, status, headers, config) {
			// this callback will be called asynchronously
			// when the response is available
			alert(status);
			$scope.rc.feedback 	= data.feedback;
			$scope.rc.rilt.id 	= data.ID;
			
			$scope.rc.addupdateText="Update Rilt";
			
			//reload
			$scope.getRiltsForConcept($scope.rilt.concept_id,0)										
			
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
		
		if($scope.rilt) {
			$scope.rc.addupdateText="Update RiLT";	
		}
		else
		{
			$scope.rc.addupdateText="Add RiLT";
		}
		
	};
	
	
	$scope.InitRilt();
	
	
	
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
