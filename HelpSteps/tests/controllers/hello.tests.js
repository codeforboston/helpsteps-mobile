describe('Hello World example ', function() {

beforeEach(module('starter'));

var CategoryListCtrl,
scope;

beforeEach(inject(function ($rootScope, $controller) {
	scope = $rootScope.$new();
	CategoryListCtrl = $controller('CategoryListCtrl', {
	$scope: scope
	});
}));

it("says hello world!", function () {
	expect(scope.greeting).toEqual('Hello World!');
});

});