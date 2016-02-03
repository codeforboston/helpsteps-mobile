angular.module('starter')

.controller('CategoryListCtrl', function($scope, $http, HelpStepsApi, $rootScope, $state, $ionicPlatform, uiGmapGoogleMapApi, $cordovaGeolocation, $cordovaToast, SQLite){
  

  $scope.getDatabase = function(){    
    debugger;
    $scope.database = SQLite.getDb();
    SQLite.findRecentSearches().then(function(data){
      $scope.recentSearches = [];
      for (var i = 0; i < data.length; i++) {
        $scope.recentSearches.push(data.item(i).keywordSearchTerm);
      };
      //$scope.$apply();
    });
  }
  document.addEventListener('deviceready', $scope.getDatabase, false);



  $scope.selectedServiceCount = 0;
  $scope.searchBarIcon = "ion-ios-search";
  $scope.locationBarIcon = "ion-location";

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
      //wait ten seconds before timing out with error
      timeout: 10000,
      //accept results up to 30 seconds old
      maximumAge: 30000      
    };

    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {            
      $rootScope.latitude = position.coords.latitude;
      $rootScope.longitude = position.coords.longitude;    

    }, function(err) {
      debugger;
      alert(err);
      $cordovaToast
      .show('We were unable to determine your location. Please try again, or enter a location manually.', 'short', 'center')
      .then(function(success) {
      // success
    }, function (error) {
      // error
    });
      
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
            $cordovaToast
            .show('Please enter a search term and a location to use text search.', 'short', 'center')
            .then(function(success) {
      // success
    }, function (error) {
      // error
    });        
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

  $scope.geocodeAddress();

    //user input from search box
    $rootScope.searchTerm = $scope.search.text.toLowerCase();
    ga('send', {
     hitType: 'event',
     eventCategory: 'Text Search',
     eventAction: 'Text Search',
     eventLabel: $rootScope.searchTerm

   });

    SQLite.addKeywordSearchToHistory($rootScope.searchTerm, $rootScope.latitude + ',' + $rootScope.longitude)
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

    SQLite.addKeywordSearchToHistory($rootScope.searchTerm, $rootScope.latitude + ',' + $rootScope.longitude)
    debugger;
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