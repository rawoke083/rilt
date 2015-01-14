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
	when('/c/new', {
		templateUrl: './views/concept.form.html',
		controller: 'ConceptCtrl',
		resolve: { loginRequired: loginRequired }
		
	}).
	when('/c/:id', {
		templateUrl: './views/concept.view.html',
		controller: 'ConceptCtrl'		
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
app.controller('RiltCtrl', function($rootScope,$scope, $http, $route, $routeParams, UsrAuth) {
	
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
app.directive('markdown', function() {
	var converter = new Showdown.converter();
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			function renderMarkdown() {
				var htmlText = converter.makeHtml(scope.$eval(attrs.markdown) || '');
				element.html(htmlText);
			}
			scope.$watch(attrs.markdown, renderMarkdown);
			renderMarkdown();
		}
	};
});

/*******************************************
 *  Serives
 ******************************************/
app.service('UsrAuth', function($http, $route, $routeParams, $location, $window, $q,$rootScope) {
	
	
	var _Email="";
	var _Id="";
	var _Access_token="";
	var _LoggedIn = false;
	
	
	
	this.init = function(email, id, access_token) {
		_Email = email;
		_Id = id;
		_Access_token = access_token;
		_LoggedIn = false;

		if(_Email.length){
			_LoggedIn = true;
		}
		
	};
	
	this.login = function(usr) {
			var deferred = $q.defer();
			$http.post('/api/v1/auth/login', usr).
			success(function(data, status, headers, config) {
					
					$window.localStorage.access_token = data.access_token;
					$window.localStorage.email = data.email;
				
		
					_Email = data.email;
					_LoggedIn = true;
					_Id = data.id;
					_Access_token = data.access_token;
			
		
				deferred.resolve(data);
				
			}).
			error(function(data, status, headers, config) {
				_LoggedIn = false;
				deferred.reject(data);
			});
			
			return deferred.promise;
		} //end login
		
	this.logout = function() {
		_LoggedIn = false;
		_Email = "";
		_Id = 0;
		_Access_token = 0;
		
		$window.localStorage.access_token = "";
		$window.localStorage.email = "";
		$window.localStorage.id = 0;
	};
	
	this.isAuthenticated = function() {
		return _LoggedIn;
	};
	
	
	this.getAccessToken= function() {
		return _Access_token;
	};
	
	
	this.getEmail = function() {
		return _Email;
	};
	
	this.isStillOk = function(){
		
		
			var deferred = $q.defer();
			$http.get('/api/v1/auth/checkme').
			success(function(data, status, headers, config) {
					
					
				deferred.resolve(data);
				
			}).
			error(function(data, status, headers, config) {
				_LoggedIn = false;
				alert("BAD");
				deferred.reject(data);
			});
			
			return deferred.promise;
			
		
	};
	
	
});


app.factory('TokenInterceptor', function($q, $window, $location,$injector) {
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
			//if (response != null && response.status == 200 && $window.localStorage.access_token) {
				//set aut=1   
			//}
			return response || $q.when(response);
		},
		/* Revoke client authentication if 401 is received */
		responseError: function(rejection) {
		
			var AuthService = $injector.get('UsrAuth');
			
			
			 if(rejection != null && rejection.status === 401  ) {
				
				AuthService.logout(); 
			
				 
                $location.path('/usr/signin');
                
                return $q.reject(rejection);
                
            }else if(rejection != null && rejection.status === 402  ) {
					AuthService.logout(); 
					alert("Expirred");
            }
            else {
                return $q.reject(rejection);
            }
			
		}
	};
});

