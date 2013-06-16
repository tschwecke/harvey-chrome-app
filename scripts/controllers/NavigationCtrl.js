 
function NavigationCtrl($scope, HarveyContext, NavigationSvc) {

	$scope.state = 'ready';
	$scope.navigation = NavigationSvc;
	$scope.selectedMenu = 'tests';

	NavigationSvc.setNavigationScope($scope);

	$scope.menuSelected  = function(menu, view) {
		$scope.selectedMenu = menu;

		NavigationSvc.navigate(view);
	};

	$scope.save = function() {
		parent.postMessage({"messageType": "saveAs", "content": js_beautify(JSON.stringify(HarveyContext.data))}, '*');

	};
}
