angular.module('starter.services', [])

.factory('HelpStepsApi', function($http){
	var allServiceCategories = [];
	return {
		GetDomainsAndChildren: function(){
			return $http.get('http://localhost:3000/api/categories/domain/include_all_children')
			.then(function(results){
				allServiceCategories = results;
				return results.data;
			});
		}
	};
});