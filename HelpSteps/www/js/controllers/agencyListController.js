angular.module('starter')

.controller('AgencyListCtrl', function($scope, HelpStepsApi, $state, $stateParams, LoadingSpinner, $cordovaGoogleAnalytics, $ionicModal,UserSearchSelections, GetCategoryIconService ){
  LoadingSpinner.show();

  $scope.referer = $stateParams.referer;

  if($scope.referer === "selectionSearch") {
      //load user's search selections from previous screen
      $scope.userSearchSelections = UserSearchSelections.getSearchObject();

      $scope.filteredUserSearchSelectionsObject = {};

  //get all service ids out of userSearchSelections and add them to object for filtering
  //this allows us to keep track of updated changes to query
  //example: Joe searches for food pantries, food stamps, and affordable housing
  //then, he decides he temporarily just wants to view food stamps
  //this will let him do that
  //create filtering model on page load
  $scope.arrayOfServiceIdsUserHasSelected = [];
  $scope.namesOfServicesUserHasSelected = [];
  angular.forEach($scope.userSearchSelections, 
    function(outerValue,parentCategory){       
      var tempOuterValue = outerValue;
      var services = outerValue.services;
      
      angular.forEach(services, function(value, key){  

        $scope.namesOfServicesUserHasSelected.push(value);
        $scope.arrayOfServiceIdsUserHasSelected.push(key);
        $scope.filteredUserSearchSelectionsObject[parentCategory] = {};
        $scope.filteredUserSearchSelectionsObject[parentCategory]['services'] = {};

        //make service objects in each category object      
        angular.forEach($scope.userSearchSelections[parseInt(parentCategory)]['services'], 
          function(serviceName,serviceId ){ 
            console.log("key: " + serviceId + serviceName)
            $scope.filteredUserSearchSelectionsObject[parentCategory]['services'][serviceId] = {};
            $scope.filteredUserSearchSelectionsObject[parentCategory]['services'][serviceId]['active'] = true;
            $scope.filteredUserSearchSelectionsObject[parentCategory]['services'][serviceId]['name'] = serviceName;
            $scope.filteredUserSearchSelectionsObject[parentCategory]['services'][serviceId]['parentCategory'] = parentCategory;
            
          })
      });
    });

  //$scope.$apply();

  //update filtering model
  $scope.$watch('filteredUserSearchSelectionsObject', function(newVal, oldVal){

    //this check is necessary, because otherwise this method will fire on page load (which we don't need)
    if(newVal !== oldVal) {

     $scope.arrayOfServiceIdsUserHasSelected = []; 
     $scope.namesOfServicesUserHasSelected = [];

     //go through all categories
     angular.forEach($scope.filteredUserSearchSelectionsObject, function(categoryObject, categoryKey){ 

      //go through all services in each category
      angular.forEach(categoryObject.services, function(serviceObject, serviceKey){
        //if the service is actively selected, add it to an array of services that are actively selected
        if(serviceObject.active == true) {
          $scope.arrayOfServiceIdsUserHasSelected.push(serviceKey);
          $scope.namesOfServicesUserHasSelected.push(serviceObject.name);
        }
      });

     //console.log("serviceObject : " + serviceObject + " thing2: " + key);

     

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

$scope.selectAllServicesInCategory = function(categoryId){

  angular.forEach($scope.filteredUserSearchSelectionsObject[categoryId].services, function(serviceObject, key){ 


    $scope.filteredUserSearchSelectionsObject[parseInt(categoryId)]['services'][key]['active'] = true;

  });

}

$scope.unselectAllServicesInCategory = function(categoryId){

  angular.forEach($scope.filteredUserSearchSelectionsObject[categoryId].services, function(serviceObject, key){ 

    $scope.filteredUserSearchSelectionsObject[parseInt(categoryId)]['services'][key]['active'] = false;

  });

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