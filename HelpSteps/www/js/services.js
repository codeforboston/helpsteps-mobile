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

.factory('SQLite', function($q){
	var db;
	document.addEventListener('deviceready', onDeviceReady, false);
	
	function onDeviceReady() {
        db = window.sqlitePlugin.openDatabase({name: "my.db", androidDatabaseImplementation: 2, androidLockWorkaround: 1});
                      
	}

	return {
		getDb: function(){
			return db;
		},

		addKeywordSearchToHistory: function(searchTerm, locationSearchCoordinates, tableName){
			var deferred = $q.defer();
			db.transaction(function(tx) {

		      tx.executeSql('CREATE TABLE IF NOT EXISTS ' +tableName+ ' (id integer primary key, searchTerm text, locationSearchCoordinates text, timeStamp long)');		  	
		  	tx.executeSql('INSERT INTO ' +tableName+ ' (searchTerm, locationSearchCoordinates, timeStamp) VALUES (?,?,?)', [searchTerm, locationSearchCoordinates, Date.now()]);
		  			  			  			
		}, function(error) {
			
		  console.log('transaction error: ' + error.message);
		}, function() {
			deferred.resolve('transaction finished');
		  console.log('transaction ok');
		});
			return deferred.promise;
		},

		findRecentSearches: function(tableName){
			//return promise
			var deferred = $q.defer();
			
			var responseRows;
						db.transaction(function(tx) {
				
		      tx.executeSql('CREATE TABLE IF NOT EXISTS '+tableName+' (id integer primary key, searchTerm text, locationSearchCoordinates text, timeStamp text)');		  			

		  	tx.executeSql('SELECT DISTINCT searchTerm, timeStamp  FROM '+tableName+' GROUP BY searchTerm ORDER BY timeStamp DESC LIMIT 10', [], function(tx, res){		  		
		  		deferred.resolve(res.rows);
		  	});
		  			
		}, function(error) {
			debugger;
		  console.log('transaction error: ' + error.message);
		}, function() {
			return responseRows;
		  console.log('transaction ok');
		});

			return deferred.promise;			
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

.service('UserSearchSelections', function () {
  var searchObject = {};

  return  {
      getSearchObject: function(){
      	return searchObject;
      },
      setSearchObject: function(searchObjectParam){
      	searchObject = searchObjectParam;
      }
  };
})

//sets the appropriate icons for service categories. Food category displays an apple, etc
.service('GetCategoryIconService', function (foodIcon, educationIcon, addictionAndRecoveryIcon) {
  
  return {
  	getIcon: function(categoryId){

  		//convert to number, if necessary
  		if(typeof categoryId == "string") {
  			categoryId = parseFloat(categoryId);
  		}

  		switch (categoryId) {
       				//help escape violence
       				case 15:
       					return 'ion-heart-broken';
       				//food
       				case 27:
       					return foodIcon;
       				//housing
       				case 40:
       					return 'ion-home';
       				//safety equipment resources
       				case 91:
       					return 'ion-help-buoy';
       				//transit
       				case 97:
       					return 'ion-android-bus';
       				//health
       				case 107:
       					return 'ion-medkit';
       				//addiction and recovery
       				case 108:
       					return addictionAndRecoveryIcon;
       				//sexual health
       				case 187:
       					return 'ion-heart';
       				//mental health
       				case 192:
       					return 'ion-android-person';
       				//nutrition and fitness
       				case 195:
       					return 'ion-ios-basketball';
       				//afterschool
       				case 253:
       					return 'ion-ios-body';
       				//parenting
       				case 298:
       					return 'ion-person-stalker';
       				//education
       				case 306:
       					return educationIcon;
       				//work
       				case 351:
       					return 'ion-briefcase';
       				//legal
       				case 375:
       					return 'ion-earth';

	              //care transitions
	              case 397:
	                return 'ion-shuffle';

       			}
  	}
  }
  
});