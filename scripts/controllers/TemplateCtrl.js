function TemplateCtrl($scope, HarveyContext, RequestContext) {

	$scope.state = '';
	$scope.template = HarveyContext.currentRequestTemplate;

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

	var populateTemplateWithRequest = function(template, request) {
		if(request.method.value)	template.method = request.method.value;
		if(request.protocol.value)	template.protocol = request.protocol.value;
		if(request.host.value)		template.host = request.host.value;
		if(request.port.value)		template.port = request.port.value;
		if(request.resource.value)	template.resource = request.resource.value;
		if(request.body.value)		template.body = request.body.value;

		template.querystring = {};
		if(request.querystring) {
			for(var i=0; i<request.querystring.length; i++) {
				var querystring = request.querystring[i];
				template.querystring[querystring.key] = querystring.value;
			}
		}
		template.headers = {};
		if(request.headers) {
			for(var i=0; i<request.headers.length; i++) {
				var header = request.headers[i];
				template.headers[header.key] = header.value;
			}
		}
	};

	RequestContext.currentRequest = createRequestFromTemplate(HarveyContext.currentRequestTemplate);
	$scope.request = RequestContext.currentRequest;
	$scope.changed = false;

	var originalRequest = null;
	$scope.$watch('request', function(newValue, oldValue) {
		if(!originalRequest) {
			originalRequest = JSON.stringify(newValue);
		}
		
		var currentRequest = JSON.stringify(newValue);
		$scope.changed = (originalRequest !== currentRequest);
	}, true);


	$scope.save = function() {
		populateTemplateWithRequest($scope.template, $scope.request);

		//Look to see if this template is already stored
		var templates = HarveyContext.data.requestTemplates;
		var found = false;
		for(var i=0; i<templates.length; i++) {
			if(templates[i] == $scope.template) {
				found = true;
				break;
			}
		}
		
		if(!found) {
			templates.push($scope.template);
		}

		HarveyContext.upcomingView = 'TemplateList';
		setTimeout(function() {
			$scope.$apply(function() {
				HarveyContext.view = 'TemplateList';
			});
		}, 500);
	};

	$scope.discard = function() {
		HarveyContext.upcomingView = 'TemplateList';
		setTimeout(function() {
			$scope.$apply(function() {
				HarveyContext.view = 'TemplateList';
			});
		}, 500);

	};
}

 
