angular.module('starter')

.controller('AgencyDetailCtrl', function($scope, HelpStepsApi, $stateParams, $state, uiGmapGoogleMapApi, $ionicModal, $cordovaEmailComposer, $cordovaToast){

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

   var servicesString = "";

   for (var i = 0; i < agency.services.length; i++) {
      servicesString += agency.services[i].name + "\n"
    }; 

   var email = {
    to: userEmail,        
    subject: 'Agency Information from HelpSteps',
    body: agency.name + "\n\n" + agency.description + "\n\nServices:\n" + servicesString + "\n" + agency.phones[0].number + "\n" + agency.website + "\n" + agency.address.address_1 + "\n" + agency.address.city + ", " + agency.address.state_province + "\n" + agency.address.postal_code + "\n",
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

      $cordovaToast
      .show('Please enter a valid 10-digit phone number to proceed.', 'short', 'center')
      .then(function(success) {
      // success
    }, function (error) {
      // error
    });
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

  $scope.openWebsiteInSystemBrowser = function() {
    cordova.InAppBrowser.open($scope.agency.website, '_system');
  }

});