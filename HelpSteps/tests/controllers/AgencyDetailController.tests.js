describe('Phone Number Validation', function() {

beforeEach(module('starter'));

var AgencyDetailCtrl,
scope;

beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    $controller('AgencyDetailCtrl', {
      $scope: scope
    });
  }));


it('successfully validates a valid phone number', function () {

	expect(scope.validatePhoneNumber("1234567890")).toEqual(true);

});

it('rejects a phone number that is too short', function () {

	expect(scope.validatePhoneNumber("123456789")).toEqual(false);

});

it('rejects a phone number that is too long', function () {

	expect(scope.validatePhoneNumber("12345678901")).toEqual(false);

});

it('rejects a phone number that contains dashes', function () {

	expect(scope.validatePhoneNumber("123-4567-890")).toEqual(false);

});

it('rejects a phone number that contains letters', function () {

	expect(scope.validatePhoneNumber("123901123F")).toEqual(false);

});

it('rejects a phone number that contains special characters', function () {

	expect(scope.validatePhoneNumber("12390112!%")).toEqual(false);

});

});