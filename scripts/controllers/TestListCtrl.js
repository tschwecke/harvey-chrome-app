 
function TestListCtrl($scope, HarveyContext) {


	$scope.context = HarveyContext;
	$scope.filteredTests = $scope.context.data.tests;
	$scope.searchString = "";
	$scope.state = '';

	$scope.$watch('context.upcomingView', function(newValue, oldValue) {
		if (newValue != 'TestList')
			$scope.state = 'fadingOut';
	});

	setTimeout(function() {
		$scope.$apply(function() {
			$scope.state = 'fadingIn';
		});
	}, 1);

	$scope.filter = function() {
		var tests = [];

		if($scope.searchString === "") {
			tests = $scope.context.data.tests;
		}
		else {
			var tags = $scope.searchString.split(' ');
			tests = filterTests($scope.context.data.tests, tags);
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
		console.log("new test clicked");
	};

	$scope.editTest = function(index) {
		$scope.context.currentTest = $scope.filteredTests[index];

		console.log('edit clicked for ' + $scope.context.currentTest.id);

		$scope.state = 'fadingOut';
		$scope.context.upcomingView = 'Test';
		setTimeout(function() {
			$scope.$apply(function() {
				$scope.context.view = 'Test';
			});
		}, 500);
	};

	$scope.deleteTest = function(index) {
		var testToDelete = $scope.filteredTests[index];

		console.log('TODO: need to confirm the delete');
		//if(confirm("Are you sure you want to delete test '" + testToDelete.id + "'?")) {
		if(true) {
			testToDelete.deleting = true;

			setTimeout(function() {
				$scope.$apply(function() {
					//Remove the test from the filtered tests
					$scope.filteredTests.splice(index, 1);

					//Find the test in the overall test list to remove it
					for(var i=0; i<$scope.context.data.tests.length; i++) {
						if(testToDelete === $scope.context.data.tests[i]) {
							$scope.context.data.tests.splice(i, 1);
						}
					}
				});
			}, 500);
		}
	};

}
