'use strict';

var quotesApp = angular.module('Quotes', ['ngResource','ngRoute', 'ngSanitize']);

quotesApp.config(function($routeProvider) {
   $routeProvider.
     when("/quote-main",  {templateUrl:'quote-main.html',  controller:QuotesCtrl}).
     when("/quote-form",  {templateUrl:'quote-form.html',  controller:QuotesCtrl})
});

quotesApp.factory('QuotesService', function($resource) {
  return $resource(
  	'http://quotes-server.herokuapp.com/quotes/:quoteId',
    {},
    { 
    	query: {method:'GET', isArray:true},
    	get: {method:'GET', params:{quoteId:''}},
    	post: {method:'POST'},
      update: {method:'PUT', params:{quoteId:''}},
      remove: {method:'DELETE', params:{quoteId:''}}
    }
  );
});

//QuotesCtrl.$inject = ['$scope', '$route', '$location','QuotesService'];
function QuotesCtrl($scope, $route, $location, $resource, QuotesService) {
  
  $scope.$route = $route;

  $scope.quotesList = [
    {text: "quote 1 text", author: "author 1"},
    {text: "quote 2 text", author: "author 2"}
  ];  

  $scope.getQuotes = function () {
    QuotesService.query({},function(response){
    	console.log(response);
    	$scope.quotesResult = response;
      $location.path('/quote-main'); 
    });    
  };

  $scope.deleteQuote = function () {
    QuotesService.remove({quoteId: '5234f84629485f0200000003'}, function() {
      $scope.getQuotes();
    }); 
  }; 

  $scope.addQuote = function() {
		var quote = new QuotesService({});
  	quote.author = 'fred';
  	quote.text = 'this is a test';
  	quote.year = '1234';
    quote.$post({}, function() {
      $scope.getQuotes();
    }); 
  }

  $scope.getQuote = function() {
    console.log('in getQuote');

    $scope.test = $scope.quotesList[1];
    console.log($scope.quotesList[1]);
    $location.path('/quote-form'); 

    /*
		var quote = QuotesService.get({quoteId: '5227849da2166e0200000001'}, function(response) {
      console.log('got response in getQuote');
      console.log(response);
      $location.path('/quote-form'); 
			$scope.quoteResult = response;			
		});
    */  	

  }

  $scope.updateQuote = function() {
		var quote = QuotesService.get({quoteId: '5234f95529485f0200000004'}, function(response) {
			quote.author = 'freddie mercury';
			quote.$update({quoteId: '5234f95529485f0200000004'});
      $scope.getQuotes();	
		});  	
  } 

  /*******
  $scope.$on('$routeChangeSuccess', function (event, currentRoute, previousRoute) {

    console.log('in routeChangeSuccess event = ');
      console.log(event);
    console.log(' currentRoute = ');
      console.log(currentRoute)
    console.log(' previousRoute = ');
      console.log(previousRoute);

    //security.previousRoute = previousRoute;
  });  
  *********/

}
