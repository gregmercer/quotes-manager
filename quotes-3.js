'use strict';

var quotesApp = angular.module('Quotes', ['ngResource','ngRoute', 'ngSanitize']);

quotesApp.config(function($routeProvider) {
   $routeProvider.
     when("/quote-list",  {templateUrl:'quote-list.html',  controller:QuoteListCtrl}).
     when("/quote-form",  {templateUrl:'quote-form.html',  controller:QuoteFormCtrl})
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

function QuotesCtrl($scope, $route, $location, $resource, QuotesService) {
  
  $scope.$route = $route;  

  $scope.getQuotes = function () {
    QuotesService.query({},function(response){
    	console.log(response);
    	$scope.quoteList = response;
      $location.path('/quote-list'); 
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

  $scope.getQuote = function(quote) {
    console.log('in getQuote');
		var quote = QuotesService.get({quoteId: '5227849da2166e0200000001'}, function(response) {
      console.log('got response in getQuote');
      console.log(response);		
		});
  }

  $scope.editQuote = function(quote) {
    console.log('in editQuote');
    $scope.quoteData = quote;
    $location.path('/quote-form');    
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

  $scope.getQuotes();
  $location.path('/quote-list'); 

}

function QuoteListCtrl($scope, $route, $location, $resource, QuotesService) {
}

function QuoteFormCtrl($scope, $route, $location, $resource, QuotesService) {
}



