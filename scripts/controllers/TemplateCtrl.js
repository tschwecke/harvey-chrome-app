function TemplateCtrl($scope, HarveyContext, RequestContext) {

	$scope.state = '';
	$scope.context = HarveyContext;

	$scope.$watch('context.upcomingView', function(newValue, oldValue) {
		if (newValue != 'Template')
			$scope.state = 'fadingOut';
	});

	setTimeout(function() {
		$scope.$apply(function() {
			$scope.state = 'fadingIn';
		});
	}, 1);

	var createRequestFromTemplate = function(template) {
		var request = {};

		request.method = { "value": template.method };
		request.protocol = { "value": template.protocol };
		request.host = { "value": template.host };
		request.port = { "value": template.port };
		request.resource = { "value": template.resource };
		request.body = { "value": template.body };

		request.headers = [];
		if(template.headers) {
			for(var headerName in template.headers) {
				request.headers.push({
					"key": headerName,
					"value": template.headers[headerName]
				});
			}
		}

		request.querystring = [];
		if(template.querystring) {
			for(var qsName in template.querystring) {
				request.querystring.push({
					"key": qsName,
					"value": template.querystring[qsName]
				});
			}
		}

		return request;
	};

	RequestContext.currentRequest = createRequestFromTemplate(HarveyContext.currentRequestTemplate);
}

 
