angular.module('starter')

.controller('AgencyListCtrl', function($scope, HelpStepsApi, $state, $stateParams, LoadingSpinner, $cordovaGoogleAnalytics, $ionicModal,UserSearchSelections, GetCategoryIconService ){
  LoadingSpinner.show();

  $scope.referer = $stateParams.referer;

  if($scope.referer === "selectionSearch") {
      //load user's search selections from previous screen
  $scope.userSearchSelections = UserSearchSelections.getSearchObject();
  debugger;
  $scope.filteredUserSearchSelectionsObject = {};

  //get all service ids out of userSearchSelections and add them to object for filtering
  //this allows us to keep track of updated changes to query
  //example: Joe searches for food pantries, food stamps, and affordable housing
  //then, he decides he temporarily just wants to view food stamps
  //this will let him do that
  //create filtering model on page load
  $scope.arrayOfServiceIdsUserHasSelected = [];
  angular.forEach($scope.userSearchSelections, 
    function(outerValue,parentCategory){       
      var tempOuterValue = outerValue;
      var services = outerValue.services;
      
      angular.forEach(services, function(value, key){  
      
        $scope.filteredUserSearchSelectionsObject[key] = {};
        $scope.filteredUserSearchSelectionsObject[key]['active'] = true;
      
        $scope.filteredUserSearchSelectionsObject[key]['name'] = true;
        $scope.filteredUserSearchSelectionsObject[key]['parentCategory'] = parentCategory;
        $scope.arrayOfServiceIdsUserHasSelected.push(key);
      
      });
  });

  debugger;
  //$scope.$apply();

  //update filtering model
  $scope.$watch('filteredUserSearchSelectionsObject', function(newVal, oldVal){
    
    if(newVal !== oldVal) {

     $scope.arrayOfServiceIdsUserHasSelected = []; 
     angular.forEach($scope.filteredUserSearchSelectionsObject, function(serviceObject, key){ 
     
     console.log("serviceObject : " + serviceObject + " thing2: " + key);

     //if it's actively selected
     if(serviceObject.active === true) {
      $scope.arrayOfServiceIdsUserHasSelected.push(key);      
     }

    }) 
}
  //true means deep watch on the collection (all changes to the collection, not just the top level)
  }, true);

  
  //update array of selected ids to read from current fullSelectionOb
  
  $scope.filterAgencies = function(agencyServiceIds) {

    return _.intersection(agencyServiceIds, $scope.arrayOfServiceIdsUserHasSelected).length > 0 === false;
  }
  }


  //get by search term if user entered text, get by selection if user tapped/browsed through
  if($stateParams.referer == "textSearch"){

    HelpStepsApi.GetAgenciesUsingKeyword().then(function(results){
      $scope.agencies = results;
      
      LoadingSpinner.hide();
    });

  } else if ($stateParams.referer == "selectionSearch") {
   HelpStepsApi.GetAgencies().then(function(results){
    debugger;
    $scope.agencies = results;
    
    LoadingSpinner.hide();
  });
 }

 $scope.getAgency = function(id){
  $state.go('/agencyDetail/' + id);
}

$scope.reportAgencyClicked = function(name, id, distance){
  $cordovaGoogleAnalytics.trackEvent('View',  'View Agency', "View Agency: " + name + ",  Agency ID: " + id + ", Agency Distance from User in Miles: " + distance);
}

$scope.showFilterModal = function(){
  
  $scope.openModal();
}


$ionicModal.fromTemplateUrl('templates/filterModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;      
    });
    $scope.openModal = function() {

      $scope.modal.show();
    };
    $scope.closeModal = function() {
      
       $scope.modal.hide();
    };

  //local function that calls the get icon service
    $scope.getIcon = function(categoryId){
      
      return GetCategoryIconService.getIcon(categoryId);
    }

});