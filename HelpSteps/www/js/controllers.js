angular.module('starter.controllers', ["starter.directives"])

.controller('CategoryListCtrl', function($scope, $http, HelpStepsApi, $rootScope, $state, $ionicPlatform, uiGmapGoogleMapApi, $cordovaGeolocation){

  $scope.selectedServiceCount = 0;


  $scope.$on('selectedServiceCount', function (event, args) {
    if(args.increaseOrDecrease == "increase"){
      $scope.selectedServiceCount += 1;
    } else {
      $scope.selectedServiceCount -= 1;
    }
    $scope.$apply();    
  });

  
  $ionicPlatform.ready(function() {
    var posOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    };

    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {            
      $rootScope.latitude = position.coords.latitude;
      $rootScope.longitude = position.coords.longitude;    

    }, function(err) {
      alert("We were unable to determine your location. Please try again, or enter a location manually.");
      console.log(err);
    });
  });

  $scope.tracker = {};
  $scope.execute = true;
  $scope.search = {};
  $scope.search.locationSearchTerm = "Use My Current Location";

  $scope.geocodeAddress = function(nextMethod, nextMethodArg){

    uiGmapGoogleMapApi.then(function(maps) {

      var geocoder = new google.maps.Geocoder();      
        //make sure that user has entered a value for search term and for location
        if(nextMethod != "selectionSearch"){
          if(!$scope.validateUserInputForTextSearch(nextMethodArg)) {
            alert("Please enter a search term and a location to use text search.");
            return false;
          }
        } else {
          //validate location has been entered          
          if(!$scope.search.locationSearchTerm || $scope.search.locationSearchTerm.length < 0 || !$rootScope.userCategoriesArray || $rootScope.userCategoriesArray.length < 1){
            alert("Please enter a location and select at least one category to use selection search.");            
            return false;
          }
        }
        
        //if user has not opted to use their physical location, look up their location with Google Geocoder
        if($scope.search.locationSearchTerm != "Use My Current Location"){
          geocoder.geocode( {"address": $scope.search.locationSearchTerm}, function(results, status){

            //geocoded coordinates
            $rootScope.latitude = results[0].geometry.location.G;
            $rootScope.longitude = results[0].geometry.location.K;
            
            $scope.performNextSearchAction(nextMethod, nextMethodArg);
          });
        } else {
          $scope.performNextSearchAction(nextMethod, nextMethodArg);
        }
        
      });
};

$scope.performNextSearchAction = function(nextMethod, nextMethodArg){
  if(nextMethod && typeof nextMethod === "function"){        
    nextMethod(nextMethodArg);
  } else if (nextMethod == "selectionSearch") {
    $state.go('serviceList', {'referer': 'selectionSearch'});
  } else if (nextMethod == "textSearch"){
    $scope.textSearch();
  }
}
// $scope.handleIconTap = function(){  
//   alert("tap");
// }

$scope.handleSearchBarFocus = function(){
  $scope.tracker.searchBarFocus = true;
}


$scope.setSearchBarFocusToFalse = function() {
  $scope.tracker.searchBarFocus = false;
  $scope.execute = false;
  console.log("false");
}


$scope.suggestions = ['Food', 'Housing', 'Addiction', 'Diabetes', 'Afterschool', 'Tutoring', 'Transportation', 'Therapy', 'Legal', 'Jobs', 'Fitness', 'Primary Care', 'Free Healthcare', 'Pediatric Healthcare', 'Shelter', 'Domestic Violence'];
$scope.locationFocusPlaceholder = 'Use My Current Location';
$scope.locationSuggestions = ['Use My Current Location', '300 Longwood Ave', 'Dorchester, MA', 'Jamaica Plain', 'Roxbury, MA', 'Jamaica Plain, MA', '75 Centre St, Jamaica Plain, MA', 'Boston, MA', 'Everett, MA'];
$scope.textSearch = function(){

  if($scope.search.text == undefined || $scope.search.text.length < 1){
    alert("Please enter a search term or select a suggested search term from the list.");
    return false;
  }

  $scope.geocodeAddress();

    //user input from search box
    $rootScope.searchTerm = $scope.search.text.toLowerCase();
    ga('send', {
     hitType: 'event',
     eventCategory: 'Text Search',
     eventAction: 'Text Search',
     eventLabel: $rootScope.searchTerm

   });

    //go to agency list. Specify text search so that proper api endpoint is hit
    $state.go('agencyList', { 'referer':'textSearch'});

  }

  $scope.textSearchFromSuggestion = function(suggestion){

    //user input from search box
    $rootScope.searchTerm = suggestion.toLowerCase();
    ga('send', {
     hitType: 'event',
     eventCategory: 'Text Search',
     eventAction: 'Text Search From Suggestion',
     eventLabel: $rootScope.searchTerm

   });
    //go to agency list. Specify text search so that proper api endpoint is hit
    $state.go('agencyList', { 'referer':'textSearch'});
  }

  HelpStepsApi.GetDomainsAndChildren()
  .then(function(results){
    $scope.categories = results;
    $rootScope.categories = results;

  });

  $scope.selectServices = function() {

    if($scope.execute == false ) {
      $scope.execute = true;
      return false;
    }
    //figure out which categories the user is interested in
    var userSelectedCategories = document.getElementsByClassName('highlighted')
    var categoriesArray = [];


    angular.forEach(userSelectedCategories, function(value, key){
      categoriesArray.push(angular.element(userSelectedCategories[key]).attr('category-id'));
    });

    $rootScope.userCategoriesArray = categoriesArray;  

    if (categoriesArray.length < 1) {           
      return false;
    }  
    
  }

  $scope.validateUserInputForTextSearch = function(searchTerm){

    var searchTermsAreNotNull = $scope.search.locationSearchTerm && ($scope.search.text || searchTerm);
    if (searchTermsAreNotNull) {
      return $scope.search.locationSearchTerm.length > 0 && (searchTerm || $scope.search.text.length > 0);
    } else {
      return false;
    }    
  };

})

.controller('ServiceListCtrl', function($scope, $rootScope, $state, $stateParams){
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
      alert("Please select at least one service to continue.");
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
      $scope.$apply();
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

.controller('AgencyListCtrl', function($scope, HelpStepsApi, $state, $stateParams, LoadingSpinner){
  LoadingSpinner.show();

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

$scope.reportAgencyClicked = function(name, id){
  ga('send', {
   hitType: 'event',
   eventCategory: 'View Agency',
   eventAction: 'View Agency Detail',
   eventLabel: "View Agency: " + name + " - Agency ID: " + id
 });
}

})

.controller('AgencyDetailCtrl', function($scope, HelpStepsApi, $stateParams, $state, uiGmapGoogleMapApi, $ionicModal, $cordovaEmailComposer){

    $scope.userInfoForExporting = {};
    $scope.userInfoForExporting.email = "";
    $scope.userInfoForExporting.phoneNumber = "";
    
  $scope.$root.secondaryButtonFunction= function(){

    $scope.openModal();
  }

  //only show the share button on the agency detail page
  $scope.$root.showShareButton = true;

  $scope.$on("$stateChangeStart", function() {
   $scope.$root.showShareButton = false;
 })

  HelpStepsApi.GetAgency($stateParams.id).then(function(result){
    $scope.agency = result.data;    

    debugger;

    $scope.transportationForAccordion = [];
    var transportation = JSON.parse($scope.agency.transportation);
    for (var i = 0; i < transportation.length; i++) {
      $scope.transportationForAccordion.push(transportation[i].route_name + " " +transportation[i].transit_type + "\n" + transportation[i].stop);
    };

    $scope.transportationObjectForAccordion = {
      name: "See Nearby Public Transportation",
      offered: $scope.transportationForAccordion
    }
    //goal: get all services, languages, and t stops into generic objects so they can be iterated over by generic ng-repeat
    $scope.servicesForAccordion = [];
    for (var i = 0; i < $scope.agency.services.length; i++) {
      $scope.servicesForAccordion.push($scope.agency.services[i].name);
    };
    $scope.languagesForAccordion = $scope.agency.languages;

    $scope.servicesObjectForAccordion = {
      name: 'See All Available Services',
      offered: $scope.servicesForAccordion
    }

    $scope.languagesObjectForAccordion = {
      name: 'See All Languages',
      offered: $scope.languagesForAccordion
    }

    

    // $scope.servicesForAccordion = 
    $scope.agencyDetails = [$scope.servicesObjectForAccordion, $scope.languagesObjectForAccordion, $scope.transportationObjectForAccordion];
    debugger;



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

    $ionicModal.fromTemplateUrl('templates/shareScreen.html', {
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
  });

  
  //sharing
  $scope.shareThroughText = function(id, phoneNumber){
    if(!$scope.validatePhoneNumber()) {
      alert("Please enter a valid ten-digit phone number to proceed.");
      return false;
    }
    
    HelpStepsApi.ShareAgencyThroughText(id, phoneNumber)
    .then(
      //success callback
      function(){
      //change to toast soon
      alert("Message sent");
      //failure callback
    }, function(error){
      alert("We were not able to send your text. Please check the number and try again.");
    });

    ga('send', {
     hitType: 'event',
     eventCategory: 'Share Agency',
     eventAction: 'Share Through SMS',
     eventLabel: $scope.agency.name

   });
  }

  $scope.shareThroughEmail = function(agency,userEmail ){

    $cordovaEmailComposer.isAvailable().then(function() {
   // is available


   var email = {
        to: userEmail,        
        subject: 'Agency Information from HelpSteps',
        body: agency.name + "\n" + agency.address.address_1 + "\n" + agency.address.city + ", " + agency.address.state_province + "\n" + agency.address.postal_code + "\n" + agency.phones[0].number,
        isHtml: false
      };

      $cordovaEmailComposer.open(email).then(null, function () {
   // user cancelled email
 });


 }, function () {
   // not available
 });

    
  }

  $scope.reportCallAgency = function(){
    ga('send', {
     hitType: 'event',
     eventCategory: 'Contact Agency',
     eventAction: 'Call Agency on Phone',
     eventLabel: $scope.agency.name

   });
  }

  $scope.phoneNumberInvalidAlert = function(){
    debugger;
    if(!$scope.validatePhoneNumber()) {
      alert("Please enter a valid ten-digit phone number to proceed.");
      return false;
    }
  }
  
  $scope.validatePhoneNumber = function(){
    $scope.phoneNumberRegex = new RegExp(/^(\d)+$/);    
    return $scope.phoneNumberRegex.test($scope.userInfoForExporting.phoneNumber) && $scope.userInfoForExporting.phoneNumber.length > 9;

  }

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };


})
