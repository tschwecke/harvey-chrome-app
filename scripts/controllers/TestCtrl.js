function TestCtrl($scope, HarveyContext, NavigationSvc, RequestSvc, ResponseSvc, RollupSvc) {

	$scope.state = '';
	$scope.test = HarveyContext.currentTest;
	$scope.id = $scope.test.id;
	$scope.test.request = $scope.test.request || {};
	$scope.test.expectedResponse = $scope.test.expectedResponse || {};
	$scope.test.setup = $scope.test.setup || [];
	$scope.test.teardown = $scope.test.teardown || [];
	$scope.changed = false;

	configureTypeAheads($scope.test, HarveyContext);

	NavigationSvc.setNavigateAwayCallback(function() {
		$scope.state = 'fadingOut';
	});

	setTimeout(function() {
		$scope.$apply(function() {
			$scope.state = 'fadingIn';
		});
	}, 1);

	RequestSvc.currentRequest = RollupSvc.rollUpRequest($scope.test.request, HarveyContext.data.requestTemplates);
	ResponseSvc.currentResponse = RollupSvc.rollUpResponse($scope.test.expectedResponse, HarveyContext.data.responseTemplates);

	var variables = getVariableList($scope.test, HarveyContext);
	RequestSvc.availableVariables = variables;
	ResponseSvc.availableVariables = variables;


	var originalRequest = null;
	$scope.request = RequestSvc.currentRequest;
	$scope.$watch('request', function(newValue, oldValue) {
		if(!originalRequest) {
			originalRequest = JSON.stringify(newValue);
		}

		var currentRequest = JSON.stringify(newValue);
		$scope.changed = (originalRequest !== currentRequest);
	}, true);

	var originalResponse = null;
	$scope.response = ResponseSvc.currentResponse;
	$scope.$watch('response', function(newValue, oldValue) {
		if(!originalResponse) {
			originalResponse = JSON.stringify(newValue);
		}

		var currentResponse = JSON.stringify(newValue);
		$scope.changed = (originalResponse !== currentResponse);
	}, true);

	$scope.$watch('id', function(newValue, oldValue) {
		$scope.changed = (newValue !== oldValue);
	});



	$scope.keep = function() {
		$scope.test.id = $scope.id;

		RequestSvc.populateTemplateWithRequest($scope.test.request);
		ResponseSvc.populateTemplateWithResponse($scope.test.expectedResponse);

		var found = false;
		for(var i=0; i<HarveyContext.data.tests.length; i++) {
			if($scope.test === HarveyContext.data.tests[i]) {
				found = true;
				break;
			}
		}
		if(!found) {
			HarveyContext.data.tests.push($scope.test);
		}
		NavigationSvc.navigate('TestList');
	};

	$scope.discard = function() {
		NavigationSvc.navigate('TestList');
	};

	//Need to do this workaround since angular doesn't support keypresses very well
	$('#newSetupId').keypress(function(e) {
		if(e.which == 13) {
			$scope.$apply(function() {
				$scope.addSetup();
			});
		}
	});

	$scope.addSetup = function() {
		if($scope.newSetupId) {
			//Need to do this workaround for getting the value since angular and the bootstrap typeahead don't mix well
			var newSetupId = $('#newSetupId').val();
			$scope.test.setup.push(newSetupId);
			$scope.newSetupId = '';
		}

		$scope.showAddSetup = false;
	};

	$scope.removeSetup = function(index) {
		delete $scope.test.setup.splice(index, 1);
	}

	//Need to do this workaround since angular doesn't support keypresses very well
	$('#newTeardownId').keypress(function(e) {
		if(e.which == 13) {
			$scope.$apply(function() {
				$scope.addTeardown();
			});
		}
	});

	$scope.addTeardown = function() {
		if($scope.newTeardownId) {
			//Need to do this workaround for getting the value since angular and the bootstrap typeahead don't mix well
			var newSetupId = $('#newTeardownId').val();
			$scope.test.teardown.push(newSetupId);
			$scope.newSetupId = '';
		}

		$scope.showAddTeardown = false;
	};

	$scope.removeTeardown = function(index) {
		delete $scope.test.teardown.splice(index, 1);
	}


	function configureTypeAheads(test, HarveyContext) {

		//Get the list of helpers for the setup and teardown input boxes
		var setupIds = [];
		for(var i=0; i<HarveyContext.data.setupAndTeardowns.length; i++) {
			setupIds.push(HarveyContext.data.setupAndTeardowns[i].id);
		}

		$('#newSetupId').typeahead({
			"source": setupIds,
			"items": 15,
			"sorter": function(items) {
				items.sort();
			}
		});

		$('#newTeardownId').typeahead({
			"source": setupIds,
			"items": 15,
			"sorter": function(items) {
				items.sort();
			}
		});
	};

	function getVariableList(test, HarveyContext) {

		//Get the list of all variables available to this test
		//First, pull in all config
		var variables = [];
		for(var configKey in HarveyContext.data.config) {
			variables.push(configKey);
		}

		//Next, include any variables created during suite setups
		for(var i=0; i<HarveyContext.data.suiteSetup.length; i++) {
			var setupId = HarveyContext.data.suiteSetup[i];
			var setupVariables = findVariablesInSetup(setupId, HarveyContext.data.setupAndTeardowns);

			for(var j=0; j<setupVariables.length; j++) {
				variables.push(setupVariables[j]);
			}
		}

		//Finally, include any variables created during test setups
		for(var i=0; i<test.setup.length; i++) {
			var setupId = test.setup[i];
			var setupVariables = findVariablesInSetup(setupId, HarveyContext.data.setupAndTeardowns);

			for(var j=0; j<setupVariables.length; j++) {
				variables.push(setupVariables[j]);
			}
		}

		return variables;
	}

	function findVariablesInSetup(setupId, setupAndTeardowns) {
		var variables = [];

		//Find the setup
		var setup = null;
		for(var j=0; j<setupAndTeardowns.length; j++) {
			if(setupAndTeardowns[j].id === setupId) {
				setup = setupAndTeardowns[j];
				break;
			}
		}

		if(setup && setup.hasOwnProperty('actions')) {
			for(var k=0; k<setup.actions.length; k++) {
				var action = setup.actions[k];
				for(propName in action) {
					if(propName === '$set') {
						var setAction = action[propName];
						for(varName in setAction) {
							variables.push(varName);
						}
					}
				}
			}
		}

		return variables;
	}
}

