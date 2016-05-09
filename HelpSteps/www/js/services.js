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
	              //if no match is found, use placeholder  
		              default:
	                return 'ion-load-d';       

       			}
  	}
  }
  
})

//used to avoid writing null/undefined values in string concat scenarios
.service('CheckForEmptyValues',function(){
	return {
		check: function(string){
			if(string == (null || undefined)) {
				return "";
			} else {
				return string;
			}
		}
	}
})

.service('Toast', function(ionicToast, $cordovaToast){

	//check platform to decide if native or web library should be used
	return {
		show: function(message){
			if(ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
				console.log("mobile");
				$cordovaToast.show(message, 'short', 'center');        
            
			} else {
				console.log("desktop");
				ionicToast.show(message, 'middle', true, 2500);
			}	
		}
	}
})

//this is an interface for storing users' past searches 
//these method are available:
//addKeywordSearch
//getKeywordSearches
//addLocationSearch
//getLocationSearches
//import note: always returns promises that you must then resole yourself
//example: UserStorgage.getKeywordSearches().then(function(keywords){
// alert("look at my awesome keywords: " + keywords);
//})
.service('UserStorage', function(LocalStorage,SQLite ){
	//check to see if it's a native mobile environment (inside an app) or a web page
	var userIsUsingApp = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);

	if(userIsUsingApp){
		return SQLite;
	} else {
		return LocalStorage;
	}	
})

//use local storage in browser when user is not in an app (SQLite is used if user is in an app)
.service('LocalStorage', function($localStorage, $q){
	$storage = $localStorage;
	//only make new objects if nothing exists
	debugger;
	if ($storage.keywordSearches == undefined) {
		$storage.keywordSearches = [];	
	}
	if ($storage.locationSearches == undefined) {
		$storage.locationSearches = [];
	}
		
	var addSearchTerm = function(searchTerm, searchTermType){
		//if it's already there, push it to the front of the list, don't add it again
		if($storage[searchTermType].indexOf(searchTerm) > -1) {				
			//find existing keyword in array				
			debugger;
			var searchTermIndex = $storage[searchTermType].indexOf(searchTerm);				
			//delete it in the array
			$storage[searchTermType].splice(searchTermIndex,1);				
			//insert it again at index 0
			$storage[searchTermType].splice(0,0,searchTerm);
		} else {
			$storage.deferred.resolve($storage[searchTermType].splice(0,0,searchTerm));	
		}
	}
	
	return {
		addKeywordSearch: function(keyword) {	
			$storage.deferred = $q.defer();	
			addSearchTerm(keyword,"keywordSearches");					
			return $storage.deferred.promise;		
		},		
		getKeywordSearches: function() {
			$storage.deferred = $q.defer();
			$storage.deferred.resolve($storage.keywordSearches);				
			return $storage.deferred.promise;		
		},
		addLocationSearch: function(location) {
			$storage.deferred = $q.defer();
			addSearchTerm(location,"locationSearches");					
			return $storage.deferred.promise;		
		},
		getLocationSearches: function() {
			$storage.deferred = $q.defer();
			$storage.deferred.resolve($storage.locationSearches);
			return $storage.deferred.promise;		
		}
	};	
})

.factory('SQLite', function($q, $rootScope){
	var db;
	document.addEventListener('deviceready', onDeviceReady, false);
	
	function onDeviceReady() {
		//important note: changed from 'my.db' to 'mynew.db' on 4/7/16
		//due to a breaking change in the cordova sqlite plugin
		//The new version of the plugin forces the location into a location that is not backed up by iCloud (by default)
		//This plays nicer with Apple terms of service
		
        db = window.sqlitePlugin.openDatabase({name: "mynew.db",location: 'default' ,androidDatabaseImplementation: 2, androidLockWorkaround: 1});
                      
	}

	return {
		getDb: function(){
			return db;
		},

		addKeywordSearch: function(searchTerm){
			var deferred = $q.defer();
			var tableName = "keyword_searches";
			db.transaction(function(tx) {

		      tx.executeSql('CREATE TABLE IF NOT EXISTS ' +tableName+ ' (id integer primary key, searchTerm text, locationSearchCoordinates text, timeStamp long)');		  	
		  	tx.executeSql('INSERT INTO ' +tableName+ ' (searchTerm,locationSearchCoordinates, timeStamp) VALUES (?,?,?)', [searchTerm, $rootScope.latitude + ',' + $rootScope.longitude, Date.now()]);
		  			  			  			
		}, function(error) {
			
		  console.log('transaction error: ' + error.message);
		}, function() {
			deferred.resolve('transaction finished');
		  console.log('transaction ok');
		});
			return deferred.promise;
		},

		getKeywordSearches: function(){
			//return promise
			var deferred = $q.defer();
			var tableName = "keyword_searches";
			var responseRows;
			db.transaction(function(tx) {
				
		      tx.executeSql('CREATE TABLE IF NOT EXISTS '+tableName+' (id integer primary key, searchTerm text, locationSearchCoordinates text, timeStamp text)');		  			

		  	tx.executeSql('SELECT DISTINCT searchTerm, timeStamp  FROM '+tableName+' GROUP BY searchTerm ORDER BY timeStamp DESC LIMIT 10', [], function(tx, res){		  		
		  		var length = res.rows.length;
		  		var results =[];
		  		for (var i = 0; i < length ; i++) {
			        results.push(res.rows.item(i).searchTerm);
			      };    			    
		  		deferred.resolve(results);
		  	});
		  			
		}, function(error) {
			debugger;
		  console.log('transaction error: ' + error.message);
		}, function() {
			return responseRows;
		  console.log('transaction ok');
		});

			return deferred.promise;			
		},
		addLocationSearch: function(searchTerm) {
			var deferred = $q.defer();
			var tableName = "location_searches";
			db.transaction(function(tx) {

		      tx.executeSql('CREATE TABLE IF NOT EXISTS ' +tableName+ ' (id integer primary key, searchTerm text, locationSearchCoordinates text, timeStamp long)');		  	
		  	tx.executeSql('INSERT INTO ' +tableName+ ' (searchTerm,locationSearchCoordinates, timeStamp) VALUES (?,?,?)', [searchTerm, $rootScope.latitude + ',' + $rootScope.longitude, Date.now()]);
		  			  			  			
		}, function(error) {
			
		  console.log('transaction error: ' + error.message);
		}, function() {
			deferred.resolve('transaction finished');
		  console.log('transaction ok');
		});
			return deferred.promise;

		},
		getLocationSearches: function() {
			//return promise
			var deferred = $q.defer();
			var tableName = "location_searches";
			var responseRows;
			db.transaction(function(tx) {
				
		      tx.executeSql('CREATE TABLE IF NOT EXISTS '+tableName+' (id integer primary key, searchTerm text, locationSearchCoordinates text, timeStamp text)');		  			

		  	tx.executeSql('SELECT DISTINCT searchTerm, timeStamp  FROM '+tableName+' GROUP BY searchTerm ORDER BY timeStamp DESC LIMIT 10', [], function(tx, res){		  		
		  		var length = res.rows.length;
		  		var results =[];
		  		for (var i = 0; i < length ; i++) {
			        results.push(res.rows.item(i).searchTerm);
			      };    			    
		  		deferred.resolve(results);
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

});