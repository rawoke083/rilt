var app = angular.module('riltApp',  [ 'ngRoute','summernote'  ]);

/*******************************************
 *  Serives
 ******************************************/
 

app.factory('UsrAuth', function($http,$route,$routeParams,$location,$window,$q,$rootScope) {
	var _loggedIn = false; // this is private
  
   var UsrAuth = {}; 
    
    var _UserName="";
    var _Email="";
    var _Id="";
    var _Access_token="";
  
	UsrAuth.init  = function(email,id,access_token){
	 _Email = email;
	 _Id = id;
	 _Access_token = access_token;
	}
	
    UsrAuth.login = function(usr) {
      
      
      
		var deferred = $q.defer();
		
      
      	$http.post('/api/v1/auth/login', usr).
		success(function(data, status, headers, config) {
			

			$window.localStorage.access_token = data.access_token;
			$window.localStorage.email = data.email;
			$window.localStorage.id = data.id;
			
			
			_loggedIn = true;
			
			_Email = data.email;
			_Id = data.id;
			_Access_token = data.access_token;
			
					  
			$location.path('/');
			
			deferred.resolve(data);
			 
		}).  
		error(function(data, status, headers, config) {
			//$scope.feedback = data.error;	
			_loggedIn = false;
			alert("BAD-LOGIN"+data.error)
			
			deferred.reject(data);
           
		}); 
		
		return deferred.promise; 
      
    }//end login
    
    UsrAuth.logout = function() {
      _loggedIn = false;
      _Email = "";
	 _Id = 0;
	 _Access_token = 0;
	 	 
		$window.localStorage.access_token = 0;
		$window.localStorage.email = 0;
		$window.localStorage.id = 0;	
      
    }
    
    UsrAuth.isAuthenticated = function() {
      return _loggedIn;
    }
    UsrAuth.getUsrName = function(){
		return _UserName;
	}
	
	UsrAuth.getEmail = function(){
		return _Email;
	}
	
    
     return UsrAuth;
    
  
});

app.directive('markdown', function () {
              var converter = new Showdown.converter();
              return {
                  restrict: 'A',
                  link: function (scope, element, attrs) {
                      function renderMarkdown() {
                          var htmlText = converter.makeHtml(scope.$eval(attrs.markdown)  || '');
                          element.html(htmlText);
                      }
                      scope.$watch(attrs.markdown, renderMarkdown);
                      renderMarkdown();
                  }
              };
          });
          

app.factory('TokenInterceptor', function ($q, $window, $location) {
    return {
        request: function (config) {
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
        response: function (response) {
            if (response != null && response.status == 200 && $window.localStorage.access_token ) {
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

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});




/***********************************************************************
 * Rilt 
 **********************************************************************/
app.controller('RiltCtrl', function ($scope,$http,$route,$routeParams,UsrAuth) {

 // $scope.isAuth = UsrAuth.isAuthenticated;
  
 $scope.init_sn=function(){

	$('.summernote').summernote();
 
 }
 
	
	$scope.getRiltLatest = function(){
  
    $http.get('/api/v1/rilt/latest').
    success(function(data, status, headers, config) {
      $scope.rilts = data;
    }).
    error(function(data, status, headers, config) {
      // log error
      alert(data)
    });
  }
  
  
  
  
   $scope.getRilt = function(id){
   
   $http.get('/api/v1/concept/'+id).
    success(function(data, status, headers, config) {
      $scope.rilt = data;
		//alert($scope.rilt)
		//UsrAuth.login();
		//alert(UsrAuth.isAuthenticated())
      
    }).
    error(function(data, status, headers, config) {
		// log error
		alert(data)
		});
  
   
   
   }
   
   
   $scope.updateRilt = function(rilt) {
       
    
    // Simple POST request example (passing data) :
$http.post('/api/v1/concept/', rilt).
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
  
    
    
    
    };//updateRilt END 
  
  
  
  
  
  if($routeParams.riltId){
	
	$scope.getRilt($routeParams.riltId);
  }
  
  
  
  
});

/********************************************************************
* User Controller 		User Controller			User Controller
********************************************************************/

app.controller('UsrCtrl', function ($rootScope,$scope,$http,$route,$routeParams,$location,$window,UsrAuth) {
	$rootScope.Usr = { 
		Email : ""
	};
	
	
	 
  
  $scope.logout=function(){
		UsrAuth.logout();
		$rootScope.Usr.Email = UsrAuth.getEmail();
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
			$scope.feedback =" ERRROR"+data;	
		});    
    
	};//registerUsr END 
	
	
	
	$scope.signInUsr = function(usr) {          
		
		UsrAuth.login(usr).then(function (response) {
	
			$rootScope.Usr.Email = UsrAuth.getEmail()
			
			
        },
         function (err) {
             alert("USR-BAD-LOGIN");
         });
		
		
		
		
		
    
	};//signInUsr END 
	
	$scope.getme=function(){
		
		//$scope.Email 
		$rootScope.Usr.Email  = UsrAuth.getEmail();
	/*
	// Simple POST request example (passing data) :
	$http.get('/api/v1/usr').
		success(function(data, status, headers, config) {
			// this callback will be called asynchronously
			// when the response is available    
			
			$scope.myemail = data.Email;
			
			
			
		}).  
		error(function(data, status, headers, config) {
			$scope.feedback = data.error;	
		});    
    */
	}//end getme
	
  

});



/**********************************
*  Interceptor -response
**********************************/

app.config(['$httpProvider', function ($httpProvider,$location) {
    $httpProvider.interceptors.push(function ($q,$location) {
        return {
            'response': function (response) {                
                return response;
            },
            'responseError': function (rejection) {
                if(rejection.status === 401) {
                  
                   $location.path('/usr/sigin');
				 return $q.reject(rejection);                   
                   
                }
               
            }
        };
    });
}]);



app.config(function configure($routeProvider,$locationProvider) {

$routeProvider.
//when('/', { controller: 'RiltCtrl', templateUrl: './views/home.html' }).

when('/rilt/new', {templateUrl: './views/rilt.form.html',  controller: 'RiltCtrl'}).
when('/rilt/feeds/:feedtype', {templateUrl: './views/rilt.html',  controller: 'RiltCtrl'}).
when('/rilt/:riltId', {templateUrl: './views/rilt.view.html',  controller: 'RiltCtrl'}).
when('/usr/signup', {templateUrl: './views/usr.reg.form.html',  controller: 'UsrCtrl'}).
when('/usr/sigin', {templateUrl: './views/usr.login.form.html',  controller: 'UsrCtrl'}).
otherwise({ redirect: '/' });

$locationProvider.html5Mode(true);


});


app.run(function ($window,UsrAuth) {
    
    if($window.localStorage.access_token && $window.localStorage.email){
		UsrAuth.init($window.localStorage.email,$window.localStorage.id,$window.localStorage.access_token)
	}
	 
});

