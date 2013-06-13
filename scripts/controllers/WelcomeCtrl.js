function WelcomeCtrl($scope, HarveyContext, NavigationSvc) {

	$scope.state = 'ready';
	$scope.context = HarveyContext;

	NavigationSvc.setNavigateAwayCallback(function() {
		$scope.state = 'fading';

		setTimeout(function() {
			$scope.state = 'hidden';
		}, 300);
	});

	$scope.openFile = function() {

		promptUserForFile(function(err, fileContents) {
			if(fileContents) {
				$scope.$apply(function(){
					//Update the tests that the TestList is pointing to
					HarveyContext.data = JSON.parse(fileContents);

					if(!HarveyContext.data.requestTemplates)	HarveyContext.data.requestTemplates = [];
					if(!HarveyContext.data.reesponseTemplates)	HarveyContext.data.responseTemplates = [];
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
		if(!HarveyContext.data.requestTemplates)	HarveyContext.data.requestTemplates = [];
		if(!HarveyContext.data.reesponseTemplates)	HarveyContext.data.responseTemplates = [];
		if(!HarveyContext.data.setupAndTeardowns)	HarveyContext.data.setupAndTeardowns = [];
		if(!HarveyContext.data.tests)				HarveyContext.data.tests = [];


		setTimeout(function() {
			NavigationSvc.navigate('TestList');
		}, 100);
	};


	var promptUserForFile = function(callback) {

		parent.postMessage({"messageType": "openFile"}, '*');

		window.addEventListener('message', function(message) {
			if(message.data.type === 'fileOpenSucceeded') {
				callback(null, message.data.content);
			}
			else {
				callback(null, null);
			}
		});

	};
}
 
