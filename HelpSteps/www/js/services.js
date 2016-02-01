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

.factory('SQLite', function(){
	var db;
	document.addEventListener('deviceready', onDeviceReady, false);
	
	function onDeviceReady() {
        db = window.sqlitePlugin.openDatabase({name: "my.db", androidDatabaseImplementation: 2, androidLockWorkaround: 1});
        

        


        db.transaction(function(tx) {
		      tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');
		  	

		  	tx.executeSql('INSERT INTO test_table (data, data_num) VALUES (?,?)', ["my test data", 42]);
		  	

		  	tx.executeSql('SELECT * FROM test_table', [], function(tx, res){
		  		debugger;
		  	});
		  	
		
		}, function(error) {
			debugger;
		  console.log('transaction error: ' + error.message);
		}, function() {
		  console.log('transaction ok');
		});

		
	}

	//            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");


	return {
		getDb: function(){
			return db;
		},

		addKeywordSearchToHistory: function(){

		}
	}

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