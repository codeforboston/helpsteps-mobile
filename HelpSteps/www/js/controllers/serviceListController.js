angular.module('starter')

.controller('ServiceListCtrl', function($scope, $rootScope, $state, $stateParams, $cordovaToast, $cordovaGoogleAnalytics, UserSearchSelections, GetCategoryIconService){
  $scope.selectedCategoryIds = {};
  $scope.fullSelectionObject = {};
  
  //used to enable/disable 'NEXT' button
  $scope.numberOfSelectedServices = 0;
  $scope.categories = $rootScope.categories;
  $scope.$watchCollection("fullSelectionObject", function(newVal, oldVal){
    
    $scope.numberOfSelectedServices = Object.keys(newVal).length;    
    
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
      Toast.show('Please select at least one service to continue.', 'short', 'center')      
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
    

    UserSearchSelections.setSearchObject($scope.fullSelectionObject);
    
   
    $cordovaGoogleAnalytics.trackEvent('Search', 'Selection Search', JSON.stringify( $scope.fullSelectionObject) + ', Latitude: ' + $rootScope.latitude + ', Longitude: '+  $rootScope.longitude)

    $state.go('agencyList', { 'referer' : 'selectionSearch'});
  }

  $scope.reportToggle = function(category, service, selected){

    if(selected){
      
      //check if the category is in the fullSelectionObject
      if($scope.fullSelectionObject[category.id]){
        //if it already exists, add service id to serviceCategoryIds array
        $scope.fullSelectionObject[category.id]['services'][service.id] = service.name;
        
      } else {
        //category doesn't exist in object yet
      
        $scope.fullSelectionObject[category.id]= {};
        //set name of category
        $scope.fullSelectionObject[category.id]['categoryName'] = category.name;
        //create empty object for services
        $scope.fullSelectionObject[category.id]['services'] = {};
        //add service to object
        $scope.fullSelectionObject[category.id]['services'][service.id] = service.name;        
      }

      //$scope.selectedNames.push("Category: " + category.name + ",  Service: " + service.name+ ", Category ID for service: " + service.id);      
      $cordovaGoogleAnalytics.trackEvent('Service Selection','Select Service','Select Service: ' + service.name + ', In Category: ' + category.name + ", Category ID for service: " + service.id + ', Latitude: ' + $rootScope.latitude + ', Longitude: '+  $rootScope.longitude)
      
    } else {
      //remove from fullSelectionObject
      delete $scope.fullSelectionObject[category.id]['services'][service.id];

      //if no services left in category, also delete the category

      if(Object.keys($scope.fullSelectionObject[category.id]['services']).length < 1){
        delete $scope.fullSelectionObject[category.id];
      }
      $cordovaGoogleAnalytics.trackEvent('Service Deselection','Deselect Service','Deselect Service: ' + service.name + ', In Category: ' + category.name + ", Category ID for service: " + service.id + ', Latitude: ' + $rootScope.latitude + ', Longitude: '+  $rootScope.longitude)
      
    }
  }

  $scope.selectAllServicesInCategory = function(category,services){

    //consider calling reportToggle in a loop

      angular.forEach(services, 
        function(value, key){ 

          
          //don't count it again if it's already selected
          if($scope.selectedCategoryIds[value.id] != true){
            $scope.selectedCategoryIds[value.id] = true;
            $scope.reportToggle(category,value,true);  
          }

      });
    
    }


    $scope.unselectAllServicesInCategory = function(category,services){

    //consider calling reportToggle in a loop

      angular.forEach(services, 
        function(value, key){ 

          //don't count it again if it's already unselected
          if($scope.selectedCategoryIds[value.id] != false){
            $scope.selectedCategoryIds[value.id] = false;
            $scope.reportToggle(category,value,false);
          }

          
      });
    
    }

    //local function that calls the get icon service
    $scope.getIcon = function(categoryId){
      
      return GetCategoryIconService.getIcon(categoryId);
    }
});