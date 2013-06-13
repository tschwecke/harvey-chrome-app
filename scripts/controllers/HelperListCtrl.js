function HelperListCtrl($scope, HarveyContext, NavigationSvc) {

	$scope.state = '';
	$scope.context = HarveyContext;
	$scope.allHelpers = $scope.context.data.setupAndTeardowns;
	$scope.filteredHelpers = $scope.context.data.setupAndTeardowns;
	$scope.searchString = "";

	NavigationSvc.setNavigateAwayCallback(function() {
		$scope.state = 'fadingOut';
	});

	setTimeout(function() {
		$scope.$apply(function() {
			$scope.state = 'fadingIn';
		});
	}, 1);

	//Determine how many tests reference each template
	if($scope.filteredHelpers) {
		for(var i=0; i<$scope.filteredHelpers.length; i++) {
			var helper = $scope.filteredHelpers[i];
			helper.usedByCount = 0;

			for(var j=0; j<$scope.context.data.tests.length; j++) {
				var test = $scope.context.data.tests[j];
				if((test.setup && test.setup.indexOf(helper.id) > -1)
					|| (test.teardown && test.teardown.indexOf(helper.id) > -1)) {
					helper.usedByCount++;
				}
			}
		}
	}

	$scope.filter = function() {
		var helpers = [];

		if($scope.searchString === "") {
			helpers = $scope.context.data.setupAndTeardowns;
		}
		else {
			var tags = $scope.searchString.split(' ');
			helpers = filterHelpers($scope.context.data.setupAndTeardowns, tags);
		}

		$scope.filteredHelpers = helpers;
	};

	var filterHelpers = function(helpers, tags) {
		//Clone the tags array so we don't modify the original
		tags = tags.slice(0);

		if(!tags || tags.length == 0) return helpers;

		var tag = tags.pop();
		var filteredHelpers = [];

		for(var i=0; i<helpers.length; i++) {
			if(helpers[i].id.toLowerCase().indexOf(tag.toLowerCase()) > -1) {
				filteredHelpers.push(helpers[i]);
			}
		}

		return filterHelpers(filteredHelpers, tags);
	};

	$scope.deleteHelper = function(index) {
		var helperToDelete = $scope.filteredHelpers[index];

		console.log('TODO: need to confirm the delete');
		//if(confirm("Are you sure you want to delete test '" + testToDelete.id + "'?")) {
		if(true) {
			helperToDelete.deleting = true;

			setTimeout(function() {
				$scope.$apply(function() {
					//Remove the test from the filtered tests
					$scope.filteredHelpers.splice(index, 1);

					//Find the test in the overall test list to remove it
					for(var i=0; i<$scope.context.data.setupAndTeardowns.length; i++) {
						if(helperToDelete === $scope.context.data.setupAndTeardowns[i]) {
							$scope.context.data.setupAndTeardowns.splice(i, 1);
						}
					}
				});
			}, 500);
		}
	};

};
 
