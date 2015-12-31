angular.module('starter.controllers', [])

.controller('CategoryListCtrl', function($scope, $http, HelpStepsApi, $rootScope, $state){
	HelpStepsApi.GetDomainsAndChildren()
  .then(function(results){
    $scope.categories = results; 
    $rootScope.categories = results;

  });

  $scope.selectServices = function() {
    //figure out which categories the user is interested in
    var userSelectedCategories = document.getElementsByClassName('highlighted')
    var categoriesArray = [];
    
    angular.forEach(userSelectedCategories, function(value, key){
      categoriesArray.push(angular.element(userSelectedCategories[key]).attr('category-id'));
    });
    $rootScope.userCategoriesArray = categoriesArray;
    $state.go('serviceList');
  }
  
})

.controller('ServiceListCtrl', function($scope, $rootScope){
  $scope.categories = $rootScope.categories;
  
  $scope.filteredCategories = [];
  //filter categories to match user's selections
  angular.forEach($scope.categories, function(value, key){
    
    if($rootScope.userCategoriesArray.indexOf(value.id.toString()) > -1){
      $scope.filteredCategories.push(value);
    }
  });
  debugger;
});

