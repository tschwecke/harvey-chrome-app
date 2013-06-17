function WelcomeCtrl($scope, HarveyContext, NavigationSvc, FileSvc) {

	$scope.state = 'ready';
	$scope.context = HarveyContext;

	NavigationSvc.setNavigateAwayCallback(navigateAwayCallback);

	NavigationSvc.setShowWelcomeCallback(function() {
		$scope.state = 'ready';
		NavigationSvc.setNavigateAwayCallback(navigateAwayCallback);
	});

	$scope.openFile = function() {

		promptUserForFile(function(err, fileContents) {
			if(fileContents) {
				$scope.$apply(function(){
					//Update the tests that the TestList is pointing to
					HarveyContext.data = JSON.parse(fileContents);

					if(!HarveyContext.data.requestTemplates)	HarveyContext.data.requestTemplates = [];
					if(!HarveyContext.data.responseTemplates)	HarveyContext.data.responseTemplates = [];
					if(!HarveyContext.data.setupAndTeardowns)	HarveyContext.data.setupAndTeardowns = [];
					if(!HarveyContext.data.tests)				HarveyContext.data.tests = [];

					HarveyContext.filteredTests = HarveyContext.data.tests;
				});
				
				setTimeout(function() {
					NavigationSvc.navigate('TestList');
				}, 100);
			}
		});
	};

	$scope.startFromScratch = function() {
		FileSvc.clear();  //Ensure that we're not still pointing to a file if the user had previously opened one.
		HarveyContext.data.requestTemplates = [];
		HarveyContext.data.responseTemplates = [];
		HarveyContext.data.setupAndTeardowns = [];
		HarveyContext.data.tests = [];

		setTimeout(function() {
			NavigationSvc.navigate('TestList');
		}, 100);
	};


	function promptUserForFile(callback) {
		FileSvc.open(callback);
	}

	function navigateAwayCallback() {
		$scope.$apply(function() {
			$scope.state = 'fading';
		});
		setTimeout(function() {
			$scope.$apply(function() {
				$scope.state = 'hidden';
			});
		}, 300);
	}
}
 
