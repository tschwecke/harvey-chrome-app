 
function SuiteCtrl($scope, HarveyContext, NavigationSvc) {

	$scope.state = '';
	$scope.context = HarveyContext;
	$scope.suite = HarveyContext.data;
	$scope.config = convertConfigObjectToArray($scope.suite.config);

	$scope.$watch("config", function(newValue, oldValue) {
		$scope.suite.config = convertConfigArrayToObject($scope.config);
	}, true);

	configureTypeAheads(HarveyContext);
	
	NavigationSvc.setNavigateAwayCallback(function() {
		$scope.state = 'fadingOut';
	});

	setTimeout(function() {
		$scope.$apply(function() {
			$scope.state = 'fadingIn';
		});
	}, 1);


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
			$scope.suite.suiteSetup.push(newSetupId);
			$scope.newSetupId = '';
		}

		$scope.showAddSetup = false;
	};

	$scope.removeSetup = function(index) {
		delete $scope.suite.suiteSetup.splice(index, 1);
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
			var newTeardownId = $('#newTeardownId').val();
			$scope.suite.suiteTeardown.push(newTeardownId);
			$scope.newTeardownId = '';
		}

		$scope.showAddTeardown = false;
	};

	$scope.removeTeardown = function(index) {
		delete $scope.suite.suiteTeardown.splice(index, 1);
	}

	$scope.addConfig = function() {
		$scope.config.push({'key': '', 'value': ''});
	}

	$scope.removeConfig = function(index) {
		$scope.config.splice(index, 1);
	}
};

function configureTypeAheads(HarveyContext) {
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
}

function convertConfigObjectToArray(configObj) {
	var configArr = [];
	for(var configKey in configObj) {
		configArr.push({"key": configKey, "value": configObj[configKey]});
	}

	return configArr;
}

function convertConfigArrayToObject(configArr) {
	var configObj = {};
	for(var i=0; i<configArr.length; i++) {
		configObj[configArr[i].key] = configArr[i].value;
	}

	return configObj;
}