var app = angular.module('riltApp',  [ 'ngRoute','summernote'  ]);


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
          


app.controller('RiltCtrl', function ($scope,$http,$route,$routeParams) {

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
* User Controller
********************************************************************/
app.controller('UsrCtrl', function ($scope,$http,$route,$routeParams) {


  
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
    // Simple POST request example (passing data) :
	$http.post('/api/v1/auth/login', usr).
		success(function(data, status, headers, config) {
			// this callback will be called asynchronously
			// when the response is available    
			$scope.feedback = data.Email;
		}).  
		error(function(data, status, headers, config) {
			$scope.feedback =" ERRROR"+data;	
		});    
    
	};//registerUsr END 
  

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



app.controller('AlertDemoCtrl', function ($scope) {
  $scope.alerts = [
    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];

  $scope.addAlert = function() {
    $scope.alerts.push({msg: 'Another alert!'});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
});


