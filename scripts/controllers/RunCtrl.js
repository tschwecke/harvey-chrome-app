function RunCtrl($scope, HarveyContext, NavigationSvc) {

	$scope.state = '';
	$scope.suite = HarveyContext.data;
	$scope.setupList = getSetupList(HarveyContext.data.suiteSetup, HarveyContext.data.setupAndTeardowns);

	NavigationSvc.setNavigateAwayCallback(function() {
		$scope.state = 'fadingOut';
	});

	setTimeout(function() {
		$scope.$apply(function() {
			$scope.state = 'fadingIn';
		});
	}, 1);

	

	$scope.run = function() {
		var suiteBuilder = new SuiteBuilder();

		harveyStatus.onSuiteSetupStarting(function(setup) {
			//Don't call $scope.$apply here because we are still within the scope of the $scope.run call
			setup.status = 'running';
		});
	
		harveyStatus.onSuiteSetupCompleted(function(setup, result) {
			$scope.$apply(function() {
				setup.status = result.passed ? 'passed' : 'failed';
			});			
		});

		harveyStatus.onTestGroupStarting(function(test) {
			$scope.$apply(function() {
				test.status = 'running';
			});
		});

		harveyStatus.onTestGroupCompleted(function(test, result) {
			$scope.$apply(function() {
				test.status = result.passed ? 'passed' : 'failed';
			});
		});

		var suiteInvoker = suiteBuilder.buildSuite($scope.suite.tests, $scope.suite, {}, harveyStatus);

		suiteInvoker(function(){});		
	};

	function getSetupList(ids, helpers) {
		var setupList = [];

		for(var i=0; i<ids.length; i++) {
			for(var j=0; j<helpers.length; j++) {
				if(ids[i] === helpers[j].id) {
					setupList.push(helpers[j]);
					break;
				}
			}
		}

		return setupList;
	}

}
