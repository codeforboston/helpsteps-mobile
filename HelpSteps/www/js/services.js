angular.module('starter.services', [])

.factory('HelpStepsApi', function($http, $rootScope, apiAddress){
	var allServiceCategories = [];
	var selectedAgencies = [];

	return {
		GetDomainsAndChildren: function(){
			return $http.get(apiAddress + '/api/categories/domain/include_all_children')
			.then(function(results){
				allServiceCategories = results.data;
				return allServiceCategories;
			});
		},
		GetAgencies: function(){
			///locations_with_distance/:location/:search_services/:tags_included'
			return $http.get(apiAddress + '/api/locations_with_distance/'+ $rootScope.latitude + ',' + $rootScope.longitude + '/' + $rootScope.selectedServices + '/false')
			.then(function(results){
								
				selectedAgencies = results.data;
				return selectedAgencies;
			});
		},

		GetAgenciesUsingKeyword: function(){
			return $http.get(apiAddress + '/api/search?keyword=' + $rootScope.searchTerm + '&coordinates=' + $rootScope.latitude + ',' + $rootScope.longitude) 
			.then(function(results){
				debugger;
				selectedAgencies = results.data;
				return selectedAgencies;
			});
		},

		GetAgency: function(id){
			///locations_with_distance/:location/:search_services/:tags_included'
			return $http.get(apiAddress + '/api/show_location_for_detail_view/' + id)
			.then(function(result){
				selectedAgency = result;
				return selectedAgency;
			});
		},

		ShareAgencyThroughText: function(agencyId, phoneNumber){
			return $http.post(apiAddress + '/api/share_location_through_text/' + agencyId + '/+1' + phoneNumber)
			.then(function(result){
				selectedAgency = result;
				return selectedAgency;
			});
		}		

	};
})

.factory('LoadingSpinner', function($ionicLoading){
	return {
		show: function(){
			$ionicLoading.show({
      		content: 'Loading...'      		
    		});			
		},
		hide: function(){
			$ionicLoading.hide();
		}
	};
})

.factory('GetUserLocationFromDevice', function($cordovaGeolocation){

});