'use strict';

// The quotesApp

var quotesApp = angular.module('Quotes', ['ngResource','ngRoute', 'ngSanitize']);

// Routes for the app

quotesApp.config(function($routeProvider) {
   $routeProvider.
     when("/quote-list",  {templateUrl:'quote-list.html',  controller:QuoteListCtrl}).
     when("/quote-form",  {templateUrl:'quote-form.html',  controller:QuoteFormCtrl})
});

// QuotesService for making REST calls

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

// The main controler - QuotesCtrl

function QuotesCtrl($scope, $route, $location, $resource, QuotesService) {
  
  $scope.$route = $route;  

  $scope.showList = function () {
    $scope.inListQuotes = true;   
    $scope.addingNewQuote = false;
    $location.path('/quote-list'); 
  };

  $scope.showForm = function () {
    $location.path('/quote-form');
  };  

  $scope.getQuotes = function () {
    console.log('in getQuotes');
    QuotesService.query({},function(response){
      console.log('getQuotes response =');
    	console.log(response);
    	$scope.quoteList = response;
      $scope.showList();
    });    
  };

  $scope.deleteQuote = function (form) {
    QuotesService.remove({quoteId: form._id}, function() {
      $scope.getQuotes();
    }); 
  }; 

  $scope.addQuote = function(form) {
    console.log('in addQuote');       
		var quote = new QuotesService({});
  	quote.author = form.author;
  	quote.text = form.text;
  	quote.year = form.year;
    quote.$post({}, function() {
      $scope.getQuotes();
    });
  };

  $scope.getQuote = function(quote) {
    console.log('in getQuote');
		var quote = QuotesService.get({quoteId: '5227849da2166e0200000001'}, function(response) {
      console.log('got response in getQuote');
      console.log(response);		
		});
  };

  $scope.editQuote = function(quote) {
    console.log('in editQuote');
    $scope.inListQuotes = false;
    $scope.addingNewQuote = false;
    if (quote == null) {
      $scope.addingNewQuote = true;
    }
    $scope.quoteData = quote;
    $scope.form = angular.copy(quote);
    $scope.showForm();    
  };  

  $scope.updateQuote = function(form) {
    console.log('in updateQuote');
    console.log(form);
    if (form._id) {
      var quote = QuotesService.get({quoteId: form._id}, function(response) {
        quote.author = form.author;
        quote.text = form.text;
        quote.year = form.year;
        quote.$update({quoteId: form._id}, function() {
          $scope.getQuotes();
        });
      });        
    } else {
      $scope.addQuote(form);
    }
  	
  }; 

  $scope.cancelForm = function(quote) {
    console.log('in cancelForm');
    $scope.getQuotes();   
  };    

  $scope.getQuotes();

}

function QuoteListCtrl($scope, $route, $location, $resource, QuotesService) {
}

function QuoteFormCtrl($scope, $route, $location, $resource, QuotesService) {
}



