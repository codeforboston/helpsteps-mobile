angular.module('starter.controllers')

.controller('ServiceListCtrl', function($scope, $rootScope, $state, $stateParams, $cordovaToast){
  $scope.selected = {};
  $scope.selectedNames = [];
  $scope.numberOfSelectedServices = 0;

  $scope.categories = $rootScope.categories;

  $scope.$watchCollection("selectedNames", function(newVal, oldVal){
    debugger;
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

    ga('send', {
     hitType: 'event',
     eventCategory: 'Selection Search',
     eventAction: 'Search for Agencies',
     eventLabel: $scope.selectedNames.join(',') + ', Latitude: 42.3245296 Longitude: -71.1021299'

   });

    $state.go('agencyList', { 'referer' : 'selectionSearch'});
  }

  $scope.reportToggle = function(category, service, selected){

    if(selected){
      //add to array
      $scope.selectedNames.push("Category: " + category + " - Service: " + service);      
      ga('send', {
       hitType: 'event',
       eventCategory: 'Service Selection',
       eventAction: 'Select Service',

       eventLabel: 'Select Service: ' + service + ' In Category: ' + category
                                     // eventLabel: 'Select ' + category + ' Service'
                                   });
    } else {
      //remove from array
      var index = $scope.selectedNames.indexOf("Category: " + category + " - Service: " + service);
      if(index > -1){
        $scope.selectedNames.splice(index, 1);
      }
      ga('send', {
       hitType: 'event',
       eventCategory: 'Service Unselection',
       eventAction: 'Unselect Service',
       eventLabel: 'Unselect Service ' + service + " In Category: " + category
     });
    }

  }
})



