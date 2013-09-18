'use strict';

var quotesApp = angular.module('Quotes', ['ngResource']);

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

function QuotesCtrl($scope, $location, $resource, QuotesService) {
  
  $scope.getQuotes = function () {
    QuotesService.query({},function(response){
    	console.log(response);
    	$scope.quotesResult = response;
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
		var quote = QuotesService.get({quoteId: '5234f95529485f0200000004'}, function(response) {
			$scope.quotesResult = response;			
		});  	
  }

  $scope.updateQuote = function() {
		var quote = QuotesService.get({quoteId: '5234f95529485f0200000004'}, function(response) {
			quote.author = 'freddie mercury';
			quote.$update({quoteId: '5234f95529485f0200000004'});
      $scope.getQuotes();	
		});  	
  }  

}
