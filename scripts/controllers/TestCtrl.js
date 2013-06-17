function TestCtrl($scope, HarveyContext, NavigationSvc, RequestSvc, ResponseSvc, RollupSvc) {

	$scope.state = '';
	$scope.test = HarveyContext.currentTest;
	$scope.id = $scope.test.id;
	$scope.changed = false;

	configureTypeAheads(HarveyContext);
	
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
}

var configureTypeAheads = function(HarveyContext) {
	var setupIds = [];
	for(var i=0; i<HarveyContext.data.setupAndTeardowns.length; i++) {
		setupIds.push(HarveyContext.data.setupAndTeardowns[i].id);
	}

	$('#newSetupId').typeahead({
		"source": setupIds
	});

	$('#newTeardownId').typeahead({
		"source": setupIds
	});


};
