function TemplateCtrl($scope, HarveyContext) {

	$scope.state = '';
	$scope.context = HarveyContext;

	$scope.$watch('context.upcomingView', function(newValue, oldValue) {
		if (newValue != 'Template')
			$scope.state = 'fadingOut';
	});

	setTimeout(function() {
		$scope.$apply(function() {
			$scope.state = 'fadingIn';
		});
	}, 1);
}

 
