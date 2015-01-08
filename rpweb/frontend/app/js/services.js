/*******************************************
 *  Serives
 ******************************************/
app.service('UsrAuth', function($http, $route, $routeParams, $location, $window, $q,$rootScope) {
	
	
	var _Email="";
	var _Id="";
	var _Access_token="";
	var _LoggedIn
	
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

