// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic',  'starter.controllers', 'starter.directives', 'starter.services', 'uiGmapgoogle-maps'])

.run(['$ionicPlatform',function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    


    debugger;
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

// .config(function (AnalyticsProvider) {
//   // Add configuration code as desired - see below
//   AnalyticsProvider
//     .logAllCalls(true)
//     .startOffline(true)
//     .useEcommerce(true, true);
// })



.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyDu3ACzX5UEHrISWJyIDEYjN40IppUvbbM',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
})

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  

  .state('categoryList', {
    url: '/categoryList',
    templateUrl: 'templates/categoryList.html',
    controller: 'CategoryListCtrl'
    
  })

  .state('serviceList', {
    url: '/serviceList',
    templateUrl: 'templates/serviceList.html',
    controller: 'ServiceListCtrl'
    
  })

  .state('agencyList', {
    url: '/agencyList',
    templateUrl: 'templates/agencyList.html',
    controller: 'AgencyListCtrl'
    
  })

  .state('agencyDetail', {
    url: '/agencyDetail/:id',
    templateUrl: 'templates/agencyDetail.html',
    controller: 'AgencyDetailCtrl'
    
  })

  $urlRouterProvider.otherwise('/categoryList');
});
