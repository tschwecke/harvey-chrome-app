 
function NavigationCtrl($scope, HarveyContext) {

	$scope.state = 'ready';
	$scope.context = HarveyContext;
	$scope.selectedMenu = 'tests';

	$scope.menuSelected  = function(menu, view) {
		$scope.selectedMenu = menu;
		$scope.context.upcomingView = view;

		setTimeout(function() {
			$scope.$apply(function() {
				$scope.context.view = view;
			});
		}, 300);
	};
}
