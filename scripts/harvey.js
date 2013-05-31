
var app = angular.module('harvey', []);

app.factory('HarveyContext', function() {
	return {
		"data" : {},
		"filteredTests": [],
		"currentTest": {}
	};
});

function WelcomeCtrl($scope, HarveyContext) {

	$scope.state = 'ready';

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
							$scope.state = 'hiding';
						});
					}, 500);

				}, 100);
			}
		});
	};

	$scope.startFromScratch = function() {
		setTimeout(function() {
			$scope.$apply(function() {
				$scope.welcomeClass = 'fadeWelcome';
			});

			setTimeout(function() {
				$scope.$apply(function() {
					$scope.welcomeClass = 'hideWelcome';
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

function TestListCtrl($scope, HarveyContext) {

	$scope.context = HarveyContext;

//	$scope.filteredTests = harveyContext.testList;


	
	$scope.searchString = "";

	$scope.filter = function() {
		var tests = [];

		if($scope.searchString === "") {
			tests = HarveyContext.data.tests;
		}
		else {
			var tags = $scope.searchString.split(' ');
			tests = filterTests(HarveyContext.data.tests, tags);
		}

		HarveyContext.filteredTests = tests;
	};

	var filterTests = function(tests, tags) {
		if(!tags || tags.length == 0) return tests;

		var tag = tags.pop();
		var filteredTests = [];

		for(var i=0; i<tests.length; i++) {
			if(tests[i].id.toLowerCase().indexOf(tag.toLowerCase()) > -1) {
				filteredTests.push(tests[i]);
			}
		}

		return filterTests(filteredTests, tags);
	};

	$scope.createTest = function() {
		console.log("new test clicked");
	};

	$scope.editTest = function(index) {
		HarveyContext.currentTest = HarveyContext.filteredTests[index];

		console.log('edit clicked for ' + HarveyContext.currentTest.id);
	};

	$scope.deleteTest = function(index) {
		var testToDelete = HarveyContext.filteredTests[index];

		console.log('TODO: need to confirm the delete');
		//if(confirm("Are you sure you want to delete test '" + testToDelete.id + "'?")) {
		if(true) {
			testToDelete.deleting = true;

			setTimeout(function() {
				$scope.$apply(function() {
					//Remove the test from the filtered tests
					HarveyContext.filteredTests.splice(index, 1);

					//Find the test in the overall test list to remove it
					for(var i=0; i<HarveyContext.data.tests.length; i++) {
						if(testToDelete === HarveyContext.data.tests[i]) {
							HarveyContext.data.tests.splice(i, 1);
						}
					}
				});
			}, 500);
		}
	};

}
