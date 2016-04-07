angular.module('starter')

.controller('AgencyDetailCtrl', function($scope, HelpStepsApi, $stateParams, $state, uiGmapGoogleMapApi, $ionicModal, $cordovaEmailComposer, $cordovaToast, $cordovaGoogleAnalytics, $rootScope, $cordovaInAppBrowser, $ionicPlatform, $timeout, $ionicScrollDelegate, $ionicPosition){

  $scope.userInfoForExporting = {};
  $scope.userInfoForExporting.email = "";
  $scope.userInfoForExporting.phoneNumber = ""; 
  //check if device is running android 6 because of new method of implementing permissions
  $scope.deviceIsRunningAndroid6 = (ionic.Platform.version() >= 6) && ionic.Platform.isAndroid()

  $scope.$root.secondaryButtonFunction= function(){

    $scope.openModal();
  }

  $scope.$root.secondaryButtonText = "Share";

  //only show the share button on appropriate pages
  $scope.$root.showShareButton = true;

  $scope.$on("$stateChangeStart", function() {
   $scope.$root.showShareButton = false;
 })

  HelpStepsApi.GetAgency($stateParams.id).then(function(result){
    $scope.agency = result.data;    



    //load up email information for android 6 mailto link

    $scope.encodedEmailSubject = encodeURIComponent('Agency Information from HelpSteps');
    $scope.servicesString = "";

   for (var i = 0; i < $scope.agency.services.length; i++) {
      $scope.servicesString += $scope.agency.services[i].name + "\n";
    }; 

    $scope.encodedEmailBody = encodeURIComponent($scope.agency.name + "\n\n" + $scope.agency.description + "\n\nServices:\n" + $scope.servicesString + "\n" + $scope.agency.phones[0].number + "\n" + $scope.agency.website + "\n" + $scope.agency.address.address_1 + "\n" + $scope.agency.address.city + ", " + $scope.agency.address.state_province + "\n" + $scope.agency.address.postal_code + "\n");
    $scope.emailBody = $scope.agency.name + "\n\n" + $scope.agency.description + "\n\nServices:\n" + $scope.servicesString + "\n" + $scope.agency.phones[0].number + "\n" + $scope.agency.website + "\n" + $scope.agency.address.address_1 + "\n" + $scope.agency.address.city + ", " + $scope.agency.address.state_province + "\n" + $scope.agency.address.postal_code + "\n";


    $scope.transportationForAccordion = [];
    var transportation = JSON.parse($scope.agency.transportation);
    if (transportation.length > 0) {
      for (var i = 0; i < transportation.length; i++) {
      $scope.transportationForAccordion.push(transportation[i].route_name + " " +transportation[i].transit_type + "\n" + transportation[i].stop);
      };
      $scope.transportationObjectForAccordion = {
        name: "See Nearby Public Transportation",
        offered: $scope.transportationForAccordion
      }
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
    $scope.agencyDetails = [$scope.servicesObjectForAccordion, $scope.languagesObjectForAccordion];
    if(transportation.length > 0 ) {
      $scope.agencyDetails.push($scope.transportationObjectForAccordion);
    } 



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
    if(!$scope.validatePhoneNumber(phoneNumber)) {

      $cordovaToast
      .show('Please enter a valid 10-digit phone number to proceed.', 'short', 'center')
      .then(function(success) {
      // success
    }, function (error) {
      // error
    });

      return false;
    }

    HelpStepsApi.ShareAgencyThroughText(id, phoneNumber)
    .then(
      //success callback
      function(){


        $cordovaToast
        .show('Message sent.', 'short', 'center')
        .then(function(success) {
      // success
    }, function (error) {
      // error
    });
      //failure callback
    }, function(error){
      
      $cordovaToast
      .show('We were not able to send your text. Please check the number and try again.', 'short', 'center')
      .then(function(success) {
      // success
    }, function (error) {
      // error
    });
    });
    $cordovaGoogleAnalytics.trackEvent('Share Agency', 'Share Through SMS', 'Agency Name: ' + $scope.agency.name + ', Agency Id: ' + $scope.agency.id + ', Latitude: ' + $rootScope.latitude + ', Longitude: ' + $rootScope.longitude )
  }

  $scope.shareThroughEmail = function(agency,userEmail ){    

    $ionicPlatform.ready(function() { 
      
      
$cordovaEmailComposer.isAvailable().then(function() {
   // is available



   var email = {
    to: userEmail,        
    subject: 'Agency Information from HelpSteps',
    body: $scope.emailBody,
    isHtml: false
  };

  $cordovaEmailComposer.open(email).then(null, function () {
   // user cancelled email
 });

  $cordovaGoogleAnalytics.trackEvent('Share Agency', 'Share Through Email', 'Agency Name: ' + $scope.agency.name + ', Agency Id: ' + $scope.agency.id + ', Latitude: ' + $rootScope.latitude + ', Longitude: ' + $rootScope.longitude );

}, function () {
   // not aveailable
   alert("There was a problem accessing your email. Please try again or send a text message instead.");
 });
      
    });
  }

  $scope.reportCallAgency = function(){   
   $cordovaGoogleAnalytics.trackEvent('Share Agency', 'Call Agency', 'Agency Name: ' + $scope.agency.name + ', Agency Id: ' + $scope.agency.id + ', Latitude: ' + $rootScope.latitude + ', Longitude: ' + $rootScope.longitude )
  }


  $scope.validatePhoneNumber = function(phoneNumber){
    $scope.phoneNumberRegex = new RegExp(/^(\d)+$/);    
    return $scope.phoneNumberRegex.test(phoneNumber) && phoneNumber.length == 10;
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

  $scope.openWebsiteInSystemBrowser = function() {
    $cordovaInAppBrowser.open($scope.agency.website, '_system');
    $cordovaGoogleAnalytics.trackEvent('View', 'View Agency Website', 'Agency Name: ' + $scope.agency.name + ', Agency Id: ' + $scope.agency.id + ', Latitude: ' + $rootScope.latitude + ', Longitude: ' + $rootScope.longitude );
  }

  $scope.openMailtoLink = function() {
    $cordovaInAppBrowser.open($scope.agency.website, '_system');
  }

  $scope.scrollToBottom = function() {
    debugger;
    //get position of phone number input
    var topOfPhoneInput = $ionicPosition.offset(angular.element(document.getElementById('phoneNumberInput'))).top;
    //scroll to left position, right position, should it animate
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, topOfPhoneInput, false);    
  }

});