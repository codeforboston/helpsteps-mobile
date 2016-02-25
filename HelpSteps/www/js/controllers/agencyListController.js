angular.module('starter')

.controller('AgencyListCtrl', function($scope, HelpStepsApi, $state, $stateParams, LoadingSpinner, $cordovaGoogleAnalytics, $ionicModal){
  LoadingSpinner.show();

  //get by search term if user entered text, get by selection if user tapped/browsed through
  if($stateParams.referer == "textSearch"){

    HelpStepsApi.GetAgenciesUsingKeyword().then(function(results){
      $scope.agencies = results;
      debugger;
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


});