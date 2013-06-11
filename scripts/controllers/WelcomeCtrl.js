function WelcomeCtrl($scope, HarveyContext) {

	$scope.state = 'ready';
	$scope.context = HarveyContext;

	$scope.openFile = function() {

		promptUserForFile(function(err, fileContents) {
			if(fileContents) {
				$scope.$apply(function(){
					//Update the tests that the TestList is pointing to
					HarveyContext.data = JSON.parse(fileContents);

					HarveyContext.filteredTests = HarveyContext.data.tests;
				});

				setTimeout(function() {
					$scope.$apply(function() {
						$scope.state = 'fading';
					});

					setTimeout(function() {
						$scope.$apply(function() {
							$scope.context.view = 'TestList';
						});
					}, 500);

				}, 100);
			}
		});
	};

	$scope.startFromScratch = function() {
		setTimeout(function() {
			$scope.$apply(function() {
				$scope.state = 'fading';
			});

			setTimeout(function() {
				$scope.$apply(function() {
					$scope.context.view = 'TestList';
				});
			}, 500);

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
 
