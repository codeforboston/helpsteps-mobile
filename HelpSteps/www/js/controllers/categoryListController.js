angular.module('starter')

.controller('CategoryListCtrl', function($scope, $http, HelpStepsApi, $rootScope, $state, $ionicPlatform, uiGmapGoogleMapApi, $cordovaGeolocation, $cordovaToast, SQLite, $cordovaGoogleAnalytics){

  $ionicPlatform.ready(function() {
    if (typeof analytics !== 'undefined'){
      //analytics.startTrackerWithId('UA-XXXXXXX-X');
      $cordovaGoogleAnalytics.startTrackerWithId('UA-72012743-1');
       
    }
  });

  //$cordovaGoogleAnalytics.trackEvent('Videos', 'Video Load Time', 'Gone With the Wind', 100);

  $scope.selectedServiceCount = 0;
  $scope.searchBarIcon = "ion-ios-search";
  $scope.locationBarIcon = "ion-location";
  $scope.tracker = {};
  $scope.execute = true;
  $scope.search = {};
  $scope.search.locationSearchTerm = "Use My Current Location";
  $scope.geolocationUpdate = "";
  $scope.lastLocationUpdateTime = Date.now();

  $scope.getRecentSearchTerms = function(){        

    //get recent keyword searches
    SQLite.findRecentSearches('keyword_searches').then(function(data){
      $scope.recentKeywordSearches = [];
      for (var i = 0; i < data.length; i++) {
        $scope.recentKeywordSearches.push(data.item(i).searchTerm);
      };    
        //after getting keyword search results...
        //get recent location searches
        SQLite.findRecentSearches('location_searches').then(function(data){
          $scope.recentLocationSearches = [];
          for (var i = 0; i < data.length; i++) {
            $scope.recentLocationSearches.push(data.item(i).searchTerm);
          };    
        });
    });    
  }
  document.addEventListener('deviceready', $scope.getRecentSearchTerms, false);
  
  $scope.$on('selectedServiceCount', function (event, args) {
    if(args.increaseOrDecrease == "increase"){
      $scope.selectedServiceCount += 1;
    } else {
      $scope.selectedServiceCount -= 1;
    }    
    $scope.$apply();
  });  

  $scope.geocodeAddress = function(nextMethod, nextMethodArg){

    uiGmapGoogleMapApi.then(function(maps) {

      var geocoder = new google.maps.Geocoder();      
        //make sure that user has entered a value for search term and for location
        if(nextMethod != "selectionSearch"){
          if(!$scope.validateUserInputForTextSearch(nextMethodArg)) {            
            $cordovaToast
            .show('Please enter a search term and a location to use text search.', 'short', 'center');        
            return false;
          }
        } else {
          //validate location has been entered          
          if(!$scope.search.locationSearchTerm || $scope.search.locationSearchTerm.length < 0 || !$rootScope.userCategoriesArray || $rootScope.userCategoriesArray.length < 1){

            $cordovaToast
            .show('Please enter a location and select at least one category to use selection search.', 'short', 'center')
            .then(function(success) {
      // success
    }, function (error) {
      // error
    });        
            return false;
          }
        }        
        //if user has not opted to use their physical location, look up their location with Google Geocoder
        if($scope.search.locationSearchTerm != "Use My Current Location"){
          geocoder.geocode( {"address": $scope.search.locationSearchTerm}, function(results, status){

            //geocoded coordinates
            $rootScope.latitude = results[0].geometry.location.lat();
            $rootScope.longitude = results[0].geometry.location.lng();

            //if google is unable to find the coordinates
            if(results[0].geometry.location.lat() == undefined || results[0].geometry.location.lat() == undefined){
              $cordovaToast.show('We were not able to locate the address you entered. Please type in another address, or select \"Use My Current Location.\"', 'short', 'center');
            }            
            //continue on with search after location has been determined            
            $scope.performNextSearchAction(nextMethod, nextMethodArg);
          });
        } else {
          //get location automatically from device
          $scope.getUserLocation();
          //when geolocation information comes back from async call
          $scope.$on('geolocationUpdate', function(event, args){           
            
            if (args === true) {
              //continue on with search after location has been determined
              $scope.performNextSearchAction(nextMethod, nextMethodArg);    
            } else {
              //if user has denied permission to use location services
              if(args.code === 1) {
                 if(Date.now() - $scope.lastLocationUpdateTime > 1000) {
                  alert("You selected \"Use My Current Location\", but have not given HelpSteps permission to access your location. If you want to allow your location to be used, go to Settings > Privacy > Location Services then set HelpSteps location services to \"While Using\". You may also choose to skip this process and type in an address instead.");
                  $scope.lastLocationUpdateTime = Date.now();                
                 }                                                
              } else {
                //show error message if user location wasn't found
              $cordovaToast.show('We were not able to access your location. Please try again or type in a location.', 'short', 'center');
              }              
            }            
          });                                            
        }
      });
};

//determines if selection search or text search is being performed, then initiates that action
//this is mostly used because geocoding has to happen before any search can occur
$scope.performNextSearchAction = function(nextMethod, nextMethodArg){
  if(nextMethod && typeof nextMethod === "function"){        
    nextMethod(nextMethodArg);
  } else if (nextMethod == "selectionSearch") {
    $state.go('serviceList', {'referer': 'selectionSearch'});
  } else if (nextMethod == "textSearch"){
    $scope.textSearch();
  }
}
$scope.handleIconTap = function(){  
  if($scope.searchBarIcon == "ion-ios-search"){
    return false;
  }
  $scope.tracker.searchBarFocus = false; 
  $scope.tracker.locationBarFocus = false; 
  $scope.searchBarIcon = "ion-ios-search";
}

$scope.handleSearchBarFocus = function(){
  $scope.tracker.searchBarFocus = true;  
  $scope.searchBarIcon = "ion-arrow-left-c";
}


$scope.setSearchBarFocusToFalse = function() {
  $scope.tracker.searchBarFocus = false;
  $scope.execute = false;
  console.log("false");
}

$scope.handleLocationBarFocus = function (){
  $scope.tracker.locationBarFocus = true; 
  $scope.tracker.searchBarFocus = false; 
  $scope.searchBarIcon = "ion-arrow-left-c";
  $scope.locationFocusPlaceholder = 'neighborhood, city, state or zip code';
}

$scope.suggestions = ['Food', 'Housing', 'Addiction', 'Diabetes', 'Afterschool', 'Tutoring', 'Transportation', 'Therapy', 'Legal', 'Jobs', 'Fitness', 'Primary Care', 'Free Healthcare', 'Pediatric Healthcare', 'Shelter', 'Domestic Violence'];
$scope.locationFocusPlaceholder = 'Use My Current Location';
$scope.locationSuggestions = ['Use My Current Location', '300 Longwood Ave', 'Dorchester, MA', 'Jamaica Plain', 'Roxbury, MA', 'Jamaica Plain, MA', '75 Centre St, Jamaica Plain, MA', 'Boston, MA', 'Everett, MA'];
$scope.textSearch = function(){  

  if($scope.search.text == undefined || $scope.search.text.length < 1){
    
    $cordovaToast
      .show('Please enter a search term or select a suggested search term from the list.', 'short', 'center')
      .then(function(success) {
      // success
    }, function (error) {
      // error
    });
    return false;
  }

    //user input from search box
    $rootScope.searchTerm = $scope.search.text.toLowerCase();
    $cordovaGoogleAnalytics.trackEvent('Search', 'Text Search', 'Search Term: ' + $rootScope.searchTerm + ', Latitude: ' + $rootScope.latitude + ', Longitude: '+  $rootScope.longitude);
  
  //  save user's keyword search term
  debugger;
    SQLite.addKeywordSearchToHistory($rootScope.searchTerm, $rootScope.latitude + ',' + $rootScope.longitude, 'keyword_searches').then(function(){            
      //save user's location search term  //async pattern: this is recorded after keyword search is saved
      SQLite.addKeywordSearchToHistory($scope.search.locationSearchTerm, $rootScope.latitude + ',' + $rootScope.longitude, 'location_searches').then(function(){        
      });
    });    
    //go to agency list. Specify text search so that proper api endpoint is hit
    $state.go('agencyList', { 'referer':'textSearch'});

  }

  $scope.textSearchFromSuggestion = function(suggestion){

    //user input from search box
    $rootScope.searchTerm = suggestion.toLowerCase();
    $cordovaGoogleAnalytics.trackEvent('Search', 'Text Search From Suggestion', $rootScope.searchTerm, + ', Latitude: ' + $rootScope.latitude + ', Longitude: '+  $rootScope.longitude);
    
    SQLite.addKeywordSearchToHistory($rootScope.searchTerm, $rootScope.latitude + ',' + $rootScope.longitude, 'keyword_searches').then(function(){
      SQLite.addKeywordSearchToHistory($scope.search.locationSearchTerm, $rootScope.latitude + ',' + $rootScope.longitude, 'location_searches').then(function(){

      });
    });
    //save user's location search term
    
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

  $scope.getUserLocation = function() {

    $ionicPlatform.ready(function() {
  
    var posOptions = {
      enableHighAccuracy: true,
      //wait ten seconds before timing out with error
      timeout: 10000,
      //accept results up to 30 seconds old
      maximumAge: 30000      
    };

    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {      
      $rootScope.latitude = position.coords.latitude;
      $rootScope.longitude = position.coords.longitude;    
      $rootScope.$broadcast('geolocationUpdate', true);
    }, function(err) {
      console.log("callback failure fires once");
      $rootScope.$broadcast('geolocationUpdate', err);              
    });
  });

  }
  
});