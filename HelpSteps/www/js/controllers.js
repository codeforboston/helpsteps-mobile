angular.module('starter.controllers', [])

.controller('CategoryListCtrl', function($scope, $http, $ionicPopover, HelpStepsApi){
	HelpStepsApi.GetDomainsAndChildren()
  .then(function(results){
    $scope.categories = results; 

  });
  

 $ionicPopover.fromTemplateUrl('templates/categoryPopover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function($event) {
  	
    $scope.popover.show($event);
  };
  
});

