angular.module('starter.directives', [])


.directive('serviceCategoryIcon', function($rootScope, $cordovaGoogleAnalytics, foodIcon, educationIcon, addictionAndRecoveryIcon){

	return {
		//element
		restrict: 'E',
		//this is a scope local to this element
		//without this specification of a local scope (called isolate in Angular), it would inherit the parent's scope
		scope: {
			category: '@',
			categoryId: '@',
      selectedCategoriesObject: '=' 
		},
    
		templateUrl: 'templates/service-category-icon.html',

       link: function ($scope, $element) {

       		$scope.icon = function(){
       			switch ($scope.categoryId) {
       				//help escape violence
       				case '15':
       					return 'ion-heart-broken';
       				//food
       				case '27':
       					return foodIcon;
       				//housing
       				case '40':
       					return 'ion-home';
       				//safety equipment resources
       				case '91':
       					return 'ion-help-buoy';
       				//transit
       				case '97':
       					return 'ion-android-bus';
       				//health
       				case '107':
       					return 'ion-medkit';
       				//addiction and recovery
       				case '108':
       					return addictionAndRecoveryIcon;
       				//sexual health
       				case '187':
       					return 'ion-heart';
       				//mental health
       				case '192':
       					return 'ion-android-person';
       				//nutrition and fitness
       				case '195':
       					return 'ion-ios-basketball';
       				//afterschool
       				case '253':
       					return 'ion-ios-body';
       				//parenting
       				case '298':
       					return 'ion-person-stalker';
       				//education
       				case '306':
       					return educationIcon;
       				//work
       				case '351':
       					return 'ion-briefcase';
       				// //legal
       				case '375':
       					return 'ion-earth';

              //care transitions
              case '397':
                return 'ion-shuffle';
              default:
                return 'ion-load-d';              

       			}

       		}();

       		$element.bind('click', function(){
                      if($scope.selectedCategoriesObject[$scope.categoryId] != true){
                        $scope.selectedCategoriesObject[$scope.categoryId] = true;  
                      } else {
                        $scope.selectedCategoriesObject[$scope.categoryId] = false;
                      }
                             			                
                            if($scope.selectedCategoriesObject[$scope.categoryId] == true){
                              
                                 $rootScope.$broadcast('selectedServiceCount', {increaseOrDecrease: "increase"});                                                              
                                  $cordovaGoogleAnalytics.trackEvent('Category Selection'                                   
                                    ,'Select Category',
                                      'Select ' + $scope.category);
                                  
                            } else {
                              $rootScope.$broadcast('selectedServiceCount', {increaseOrDecrease: "decrease"});
                              $cordovaGoogleAnalytics.trackEvent('Category Selection',
                                'Unselect Category','Unselect Category');                              
                            }
       		});

          
       }
	};
})


.directive('positionBarsAndContent', function($timeout) {

 return {
    
    restrict: 'AC',
    
    link: function(scope, element) {
      
      var offsetTop = 0;
      
      // Get the parent node of the ion-content
      var parent = angular.element(element[0].parentNode);
      
      // Get all the headers in this parent
      //var headers = parent[0].getElementsByClassName('bar-subheader');
      //var headers = document.getElementsByClassName('bar-subheader');
      //var headers = angular.element(elem.querySelector('.bar-subheader'));
      //var headers = document.getElementsByClassName('doubleHeaderSelector');
      var headers = angular.element(document.getElementsByClassName('doubleHeaderSelector'));
      debugger;
      // alert("headers count: " + headers.length);
      // Iterate through all the headers
      for(var x=0;x<headers.length;x++)
      {
          // If this is not a footer bar, adjust it's position and calculate offset

          if(headers[x].className.indexOf('bar-footer') === -1) {
            
            // If this is not the main header or nav-bar, adjust its position to be below the previous header
            debugger;
            if(x > 0) {
              headers[x].style.top = offsetTop + 'px';
            }
  
            // Add up the heights of all the header bars
            offsetTop = offsetTop + headers[x].offsetHeight;
          }
      }      
      
      // Position the ion-content element directly below all the headers
      element[0].style.top = offsetTop + 'px';
      
    }
  };  
})


.filter("prettyDistance", function() {
    return function(miles) {
        if (miles < 0.1) {
            return "less than 500 feet";
        } else {
          return miles.toFixed(1) + " miles";
        }
    };
});
