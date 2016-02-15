angular.module('starter')

.controller('ServiceListCtrl', function($scope, $rootScope, $state, $stateParams, $cordovaToast, $cordovaGoogleAnalytics){
  $scope.selected = {};
  $scope.selectedNames = [];
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
    angular.forEach($scope.selected, function(value, key){
      if(value){
        selectedServices.push(key);
      }
    });
    $rootScope.selectedServices = selectedServices.join(',');

   //  ga('send', {
   //   hitType: 'event',
   //   eventCategory: 'Search',
   //   eventAction: 'Selection Search',
   //   eventLabel: $scope.selectedNames.join(',') + ', Latitude: ' + $rootScope.latitude + ', Longitude: '+  $rootScope.longitude

   // });
    $cordovaGoogleAnalytics.trackEvent('Search', 'Selection Search', $scope.selectedNames.join(',') + ', Latitude: ' + $rootScope.latitude + ', Longitude: '+  $rootScope.longitude)

    $state.go('agencyList', { 'referer' : 'selectionSearch'});
  }

  $scope.reportToggle = function(category, service, selected){

    if(selected){
      //add to array
      $scope.selectedNames.push("Category: " + category + " - Service: " + service);      
      $cordovaGoogleAnalytics.trackEvent('Service Selection','Select Service','Select Service: ' + service + ' In Category: ' + category)
      
    } else {
      //remove from array
      var index = $scope.selectedNames.indexOf("Category: " + category + " - Service: " + service);
      if(index > -1){
        $scope.selectedNames.splice(index, 1);
      }
      $cordovaGoogleAnalytics.trackEvent('Service Deselection','Deselect Service','Deselect Service: ' + service + ' In Category: ' + category)
      
    }

  }
})



