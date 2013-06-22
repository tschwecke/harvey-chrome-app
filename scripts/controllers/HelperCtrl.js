function HelperCtrl($scope, HarveyContext, NavigationSvc, RequestSvc, ResponseSvc, RollupSvc) {

	$scope.state = '';
	$scope.helper = HarveyContext.currentHelper;
	$scope.id = $scope.helper.id;
	$scope.changed = false;

	NavigationSvc.setNavigateAwayCallback(function() {
		$scope.state = 'fadingOut';
	});

	setTimeout(function() {
		$scope.$apply(function() {
			$scope.state = 'fadingIn';
		});
	}, 1);

	RequestSvc.currentRequest = RollupSvc.rollUpRequest($scope.helper.request, HarveyContext.data.requestTemplates);
	ResponseSvc.currentResponse = RollupSvc.rollUpResponse($scope.helper.expectedResponse, HarveyContext.data.responseTemplates);

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
		$scope.helper.id = $scope.id;
		RequestSvc.populateTemplateWithRequest($scope.helper.request);
		ResponseSvc.populateTemplateWithResponse($scope.helper.expectedResponse);
		addIfNew(HarveyContext.data.setupAndTeardowns, $scope.helper);

		NavigationSvc.navigate('HelperList');
	};

	$scope.discard = function() {
		NavigationSvc.navigate('HelperList');
	};

	function addIfNew(helperList, helper) {
		var alreadyAdded = false;
		for(var i=0; i<helperList.length; i++) {
			if(helperList[i] == helper) {
				alreadyAdded = true;
				break;
			}
		}

		if(!alreadyAdded) {
			helperList.push(helper);
		}
	}

}
