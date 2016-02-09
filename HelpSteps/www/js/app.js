// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.directives', 'starter.services', 'uiGmapgoogle-maps', 'ngCordova', 'ngMask'])

// .constant("apiAddress", "http://ec2-52-23-222-123.compute-1.amazonaws.com")
 .constant("apiAddress", "http://api2.helpsteps.com")


.run(['$ionicPlatform',function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
  if(window.cordova && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  }
  if(window.StatusBar) {
    StatusBar.styleDefault();



}
  
  
});
}])

.config(function(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyDu3ACzX5UEHrISWJyIDEYjN40IppUvbbM',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
      });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){

  var jsScrolling = (ionic.Platform.isAndroid() ) ? false : true;
  $ionicConfigProvider.scrolling.jsScrolling(jsScrolling);

  if( ionic.Platform.isIPad() ) {
    $ionicConfigProvider.views.transition('none');
  }


  $stateProvider
  

  .state('categoryList', {
    cache: false,
    url: '/categoryList',
    templateUrl: 'templates/categoryList.html',
    controller: 'CategoryListCtrl'
    
  })

  .state('serviceList', {
    cache: false,
    url: '/serviceList',
    templateUrl: 'templates/serviceList.html',
    controller: 'ServiceListCtrl',
    params: {
      'referer': 'default', 
    }
    
  })

  .state('agencyList', {
    cache: false,
    url: '/agencyList',
    templateUrl: 'templates/agencyList.html',
    controller: 'AgencyListCtrl',
    params: {
      'referer': 'default', 
    }
    
  })

  .state('agencyDetail', {
    url: '/agencyDetail/:id',
    templateUrl: 'templates/agencyDetail.html',
    controller: 'AgencyDetailCtrl'
    
  })

  $urlRouterProvider.otherwise('/categoryList');
});
