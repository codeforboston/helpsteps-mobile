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

.controller('ServiceListCtrl', function($scope, $rootScope, $state){
  $scope.selected = {};

  $scope.categories = $rootScope.categories;
  
  $scope.filteredCategories = [];
  //filter categories to match user's selections
  angular.forEach($scope.categories, function(value, key){
    
    if($rootScope.userCategoriesArray.indexOf(value.id.toString()) > -1){
      $scope.filteredCategories.push(value);
    }
  });
  

  $scope.getAgencies = function(){
    //generate list of selected services
    var selectedServices = [];
    angular.forEach($scope.selected, function(value, key){
      if(value == true){
        selectedServices.push(key);
        alert(key);
      }
    });
    debugger;
    $rootScope.selectedServices = selectedServices.join(',');
    $state.go('agencyList');
  }
})

.controller('AgencyListCtrl', function($scope, HelpStepsApi, $state){
  HelpStepsApi.GetAgencies().then(function(results){
    $scope.agencies = results;
    debugger;
  });

  $scope.getAgency = function(id){
    $state.go('/agencyDetail/' + id);
  }
  
})   

.controller('AgencyDetailCtrl', function($scope, HelpStepsApi, $stateParams, $state, uiGmapGoogleMapApi){
  
  HelpStepsApi.GetAgency($stateParams.id).then(function(result){
    $scope.agency = result.data;
    
    
    var latitude = $scope.agency.latitude;
  var longitude = $scope.agency.longitude;
  $scope.map = {center: {latitude: latitude, longitude: longitude }, zoom: 16 };
    $scope.marker = {
      id: 0,
      coords: {
        latitude: latitude,
        longitude: longitude
      }
    };
  



  });
  
});

