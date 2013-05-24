
var app = angular.module('harvey', []);

app.factory('harveyContext', function() {
	return {
		"data" : {},
		"testList": [],
		"currentTest": {}
	};
});

function WelcomeCtrl($scope, harveyContext) {


	$scope.openFile = function() {
	

		promptUserForFile(function(err, fileContents) {
			if(fileContents) {
				$scope.$apply(function(){
					//Update the tests that the TestList is pointing to
					harveyContext.data = JSON.parse(fileContents);
					harveyContext.testList = harveyContext.data.tests;
				});

				setTimeout(function() {
					$scope.$apply(function() {
						$scope.state = 'fading';
					});

					setTimeout(function() {
						$scope.$apply(function() {
							$scope.welcomeClass = 'hiding';
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

function TestListCtrl($scope, harveyContext) {

	$scope.$watch('harveyContext.testList', function(newValue, oldValue) {
		$scope.filteredTests = newValue;
	});
//	$scope.filteredTests = harveyContext.testList;


	
	$scope.searchString = "";

	$scope.filter = function() {
		var tests = [];

		if($scope.searchString === "") {
			tests = harveyContext.testList;
		}
		else {
			var tags = $scope.searchString.split(' ');
			tests = filterTests(harveyContext.testList, tags);
		}

		$scope.filteredTests = tests;
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
		alert("new test");
	};

	$scope.editTest = function(index) {
		harveyContext.currentTest = $scope.filteredTests[index];

		alert(harveyContext.currentTest.id);
	};

	$scope.deleteTest = function(index) {
		var testToDelete = $scope.filteredTests[index];

		if(confirm("Are you sure you want to delete test '" + testToDelete.id + "'?")) {
			testToDelete.deleting = true;

			setTimeout(function() {
				$scope.$apply(function() {
					//Remove the test from the filtered tests
					$scope.filteredTests.splice(index, 1);

					//Find the test in the overall test list to remove it
					for(var i=0; i<harveyContext.testList.tests.length; i++) {
						if(testToDelete === harveyContext.testList.tests[i]) {
							harveyContext.testList.tests.splice(i, 1);
						}
					}
				});
			}, 500);
		}
	};

}
