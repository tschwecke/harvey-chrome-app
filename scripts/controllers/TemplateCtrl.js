function TemplateCtrl($scope, HarveyContext, NavigationSvc, RequestSvc, ResponseSvc) {

	$scope.state = '';
	$scope.template = HarveyContext.currentTemplate;
	$scope.id = $scope.template.id;
	$scope.templateType = HarveyContext.currentTemplateType;
	$scope.displayTemplates = false;


	NavigationSvc.setNavigateAwayCallback(function() {
		$scope.state = 'fadingOut';
	});

	setTimeout(function() {
		$scope.$apply(function() {
			$scope.state = 'fadingIn';
		});
	}, 1);

	if(HarveyContext.currentTemplateType === 'Request') {
		RequestSvc.setRequestFromTemplate(HarveyContext.currentTemplate);
		$scope.requestOrResponse = RequestSvc.currentRequest;
	}
	else {
		ResponseSvc.setResponseFromTemplate(HarveyContext.currentTemplate);
		$scope.requestOrResponse = ResponseSvc.currentResponse;
	}
	$scope.changed = false;

	var originalValue = null;
	$scope.$watch('requestOrResponse', function(newValue, oldValue) {
		if(!originalValue) {
			originalValue = JSON.stringify(newValue);
		}
		
		var currentValue = JSON.stringify(newValue);
		$scope.changed = (originalValue !== currentValue);
	}, true);

	$scope.$watch('id', function(newValue, oldValue) {
		$scope.changed = (newValue !== oldValue);
	});


	$scope.keep = function() {
		$scope.template.id = $scope.id;
		if(HarveyContext.currentTemplateType === 'Request') {
			RequestSvc.populateTemplateWithRequest($scope.template);
			RequestSvc.addIfNew(HarveyContext.data.requestTemplates, $scope.template);
		}
		else {
			ResponseSvc.populateTemplateWithResponse($scope.template);
			ResponseSvc.addIfNew(HarveyContext.data.responseTemplates, $scope.template);
		}
		
		NavigationSvc.navigate('TemplateList');
	};

	$scope.discard = function() {
		NavigationSvc.navigate('TemplateList');
	};
}

 
