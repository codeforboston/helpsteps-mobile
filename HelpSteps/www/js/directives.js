angular.module('starter.directives', [])


.directive('serviceCategoryIcon', function(){
	
	return {
		//element
		restrict: 'E',
		//this is a scope local to this element
		//without this specification of a local scope (called isolate in Angular), it would inherit the parent's scope
		scope: { 
			category: '@',
			categoryId: '@'
			
			
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
       					return 'ion-pizza';
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
       					return 'ion-wineglass';		
       				//sexual health
       				case '187':
       					return 'ion-heart';		
       				//mental health
       				case '192':
       					return 'ion-android-person';	
       				//nutrition and fitness
       				case '195':
       					return 'ion-android-bicycle';	
       				//afterschool
       				case '253':
       					return 'ion-ios-body';	
       				//parenting
       				case '298':
       					return 'ion-person-stalker';
       				//education
       				case '306':
       					return 'ion-paper-airplane';
       				//work
       				case '350':
       					return 'ion-briefcase';		
       				//legal
       				case '374':
       					return 'ion-earth';				
       				
       			}
       			
       		}();

       		$element.bind('click', function(){
       			
       			$element.toggleClass('highlighted');
       		});
      		
       }
	};
})


;