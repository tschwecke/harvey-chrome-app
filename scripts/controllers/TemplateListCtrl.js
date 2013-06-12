function TemplateListCtrl($scope, HarveyContext) {

	$scope.state = '';
	$scope.context = HarveyContext;
	$scope.filteredRequestTemplates = $scope.context.data.requestTemplates;
	$scope.allRequestTemplates = $scope.context.data.requestTemplates;
	$scope.filteredResponseTemplates = $scope.context.data.responseTemplates;
	$scope.allResponseTemplates = $scope.context.data.responseTemplates;
	$scope.searchString = "";

	$scope.$watch('context.upcomingView', function(newValue, oldValue) {
		if (newValue != 'TemplateList')
			$scope.state = 'fadingOut';
	});

	setTimeout(function() {
		$scope.$apply(function() {
			$scope.state = 'fadingIn';
		});
	}, 1);


	//Determine how many tests reference each template
	if($scope.filteredRequestTemplates && $scope.filteredResponseTemplates) {
		for(var i=0; i<$scope.filteredRequestTemplates.length; i++) {
			var template = $scope.filteredRequestTemplates[i];
			template.usedByCount = 0;

			for(var j=0; j<$scope.context.data.tests.length; j++) {
				var test = $scope.context.data.tests[j];
				if(test.request && test.request.templates && test.request.templates.indexOf(template.id) > -1) {
					template.usedByCount++;
				}
			}
		}
		for(var i=0; i<$scope.filteredResponseTemplates.length; i++) {
			var template = $scope.filteredResponseTemplates[i];
			template.usedByCount = 0;

			for(var j=0; j<$scope.context.data.tests.length; j++) {
				var test = $scope.context.data.tests[j];
				if(test.expectedResponse && test.expectedResponse.templates && test.expectedResponse.templates.indexOf(template.id) > -1) {
					template.usedByCount++;
				}
			}
		}
	}

	$scope.filter = function() {
		var requestTemplates = [];
		var responseTemplates = [];

		if($scope.searchString === "") {
			requestTemplates = HarveyContext.data.requestTemplates;
			responseTemplates = HarveyContext.data.responseTemplates;
		}
		else {
			var tags = $scope.searchString.split(' ');
			requestTemplates = filterTemplates(HarveyContext.data.requestTemplates, tags);
			responseTemplates = filterTemplates(HarveyContext.data.responseTemplates, tags);
		}

		$scope.filteredRequestTemplates = requestTemplates;
		$scope.filteredResponseTemplates = responseTemplates;
	};

	var filterTemplates = function(templates, tags) {
		//Clone the tags array so we don't modify the original
		tags = tags.slice(0);

		if(!tags || tags.length == 0) return templates;

		var tag = tags.pop();
		var filteredTemplates = [];

		for(var i=0; i<templates.length; i++) {
			if(templates[i].id.toLowerCase().indexOf(tag.toLowerCase()) > -1) {
				filteredTemplates.push(templates[i]);
			}
		}

		return filterTemplates(filteredTemplates, tags);
	};

	$scope.editRequestTemplate = function(index) {
		$scope.context.currentRequestTemplate = $scope.filteredRequestTemplates[index];

		$scope.state = 'fadingOut';
		$scope.context.upcomingView = 'Template';
		setTimeout(function() {
			$scope.$apply(function() {
				$scope.context.view = 'Template';
			});
		}, 500);
	};

	$scope.deleteRequestTemplate = function(index) {
		var templateToDelete = $scope.filteredRequestTemplates[index];

		console.log('TODO: need to confirm the delete');
		if(true) {
			templateToDelete.deleting = true;

			setTimeout(function() {
				$scope.$apply(function() {
					//Remove the template from the filtered tests
					$scope.filteredRequestTemplates.splice(index, 1);

					//Find the test in the overall test list to remove it
					for(var i=0; i<$scope.context.data.requestTemplates.length; i++) {
						if(templateToDelete === $scope.context.data.requestTemplates[i]) {
							$scope.context.data.requestTemplates.splice(i, 1);
						}
					}
				});
			}, 500);
		}
	};

	$scope.deleteResponseTemplate = function(index) {
		var templateToDelete = $scope.filteredResponseTemplates[index];

		console.log('TODO: need to confirm the delete');
		if(true) {
			templateToDelete.deleting = true;

			setTimeout(function() {
				$scope.$apply(function() {
					//Remove the template from the filtered tests
					$scope.filteredResponseTemplates.splice(index, 1);

					//Find the test in the overall test list to remove it
					for(var i=0; i<$scope.context.data.responseTemplates.length; i++) {
						if(templateToDelete === $scope.context.data.responseTemplates[i]) {
							$scope.context.data.responseTemplates.splice(i, 1);
						}
					}
				});
			}, 500);
		}
	};


};
 
