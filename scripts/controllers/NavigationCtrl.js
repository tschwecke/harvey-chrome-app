 
function NavigationCtrl($scope, HarveyContext, NavigationSvc, FileSvc) {

	$scope.state = 'ready';
	$scope.navigation = NavigationSvc;
	$scope.selectedMenu = 'tests';

	NavigationSvc.setNavigationScope($scope);

	$scope.menuSelected  = function(menu, view) {
		$scope.selectedMenu = menu;

		NavigationSvc.navigate(view);
	};

	$scope.save = function() {
		FileSvc.save(HarveyContext.data);
	};
	
	$scope.close = function() {
		NavigationSvc.navigate('Welcome');
	};
}
