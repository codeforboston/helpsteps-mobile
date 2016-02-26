angular.module('starter')

.controller('ServiceListCtrl', function($scope, $rootScope, $state, $stateParams, $cordovaToast, $cordovaGoogleAnalytics){
  $scope.selectedCategoryIds = {};
  $scope.selectedNames = [];
  
  //used to enable/disable 'NEXT' button
  $scope.numberOfSelectedServices = 0;

  $scope.categories = $rootScope.categories;

  $scope.$watchCollection("selectedNames", function(newVal, oldVal){
    $scope.numberOfSelectedServices = newVal.length;

  });

  $scope.filteredCategories = [];
  //filter categories to match user's selections
  angular.forEach($scope.categories, function(value, key){


    if($rootScope.userCategoriesArray.indexOf(value.id.toString()) > -1){
      $scope.filteredCategories.push(value);
    }
  });


  $scope.getAgencies = function(){

    //make sure user has selected at least one service to search for
    if($scope.numberOfSelectedServices < 1) {      
      $cordovaToast
      .show('Please select at least one service to continue.', 'short', 'center')
      .then(function(success) {
      // success
    }, function (error) {
      // error
    });

      return false;
    }

    //generate list of selected services
    var selectedServices = [];
    angular.forEach($scope.selectedCategoryIds, function(value, key){
      if(value){
        selectedServices.push(key);
      }
    });
    $rootScope.selectedServices = selectedServices.join(',');
    $rootScope.selectedNames = $scope.selectedNames;
    debugger;
   
    $cordovaGoogleAnalytics.trackEvent('Search', 'Selection Search', $scope.selectedNames.join(',') + ', Latitude: ' + $rootScope.latitude + ', Longitude: '+  $rootScope.longitude)

    $state.go('agencyList', { 'referer' : 'selectionSearch'});
  }

  $scope.reportToggle = function(category, service, selected){

    if(selected){
      //add to array
      debugger;
      $scope.selectedNames.push("Category: " + category.name + ",  Service: " + service.name+ ", Category ID for service: " + service.id);      
      $cordovaGoogleAnalytics.trackEvent('Service Selection','Select Service','Select Service: ' + service.name + ', In Category: ' + category.name + ", Category ID for service: " + service.id + ', Latitude: ' + $rootScope.latitude + ', Longitude: '+  $rootScope.longitude)
      
    } else {
      //remove from array
      var index = $scope.selectedNames.indexOf("Category: " + category.name + ",  Service: " + service.name+ ", Category ID for service: " + service.id);
      if(index > -1){
        $scope.selectedNames.splice(index, 1);
      }
      $cordovaGoogleAnalytics.trackEvent('Service Deselection','Deselect Service','Deselect Service: ' + service.name + ', In Category: ' + category.name + ", Category ID for service: " + service.id + ', Latitude: ' + $rootScope.latitude + ', Longitude: '+  $rootScope.longitude)
      
    }
  }
})



