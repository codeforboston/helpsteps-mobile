angular.module('starter.services', [])

.factory('HelpStepsApi', function($http, $rootScope){
	var allServiceCategories = [];
	var selectedAgencies = [];
	return {
		GetDomainsAndChildren: function(){
			return $http.get('https://api2.helpsteps.com/api/categories/domain/include_all_children')
			.then(function(results){
				allServiceCategories = results.data;
				return allServiceCategories;
			});
		},
		GetAgencies: function(){
			///locations_with_distance/:location/:search_services/:tags_included'
			return $http.get('https://api2.helpsteps.com/api/locations_with_distance/42.3245296,-71.1021299/' + $rootScope.selectedServices + '/false')
			.then(function(results){
				selectedAgencies = results.data;
				return selectedAgencies;
			});
		},

		GetAgency: function(id){
			///locations_with_distance/:location/:search_services/:tags_included'
			return $http.get('https://api2.helpsteps.com/api/show_location_for_detail_view/' + id)
			.then(function(result){
				selectedAgency = result;
				return selectedAgency;
			});
		}





		

	};
});