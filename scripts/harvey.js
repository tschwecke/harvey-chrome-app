
var app = angular.module('harvey', []);

app.factory('HarveyContext', function() {
	return {
		"data" : {},
		"filteredTests": [],
		"currentTest": {},
		"currentTemplate": {},
		"currentTemplateType": '',
		"currentHelper": {}
	};
});


app.factory('NavigationSvc', function() {
	var constructor = function() {
		var _callback = null;
		var _navigationScope = null;
		var _self = this;

		this.view = null;

		this.navigate = function(view) {
			if(_callback) {
				_callback();
			}
			setTimeout(function() {
				_navigationScope.$apply(function() {
					_self.view = view;
				});
			}, 300);

		};

		this.setNavigateAwayCallback = function(callback) {
			_callback = callback;
		};

		this.setNavigationScope = function(navigationScope) {
			_navigationScope = navigationScope;
		};
	};

	return new constructor();
});


app.factory('RollupSvc', function() {
	var constructor = function() {
		var _colors = ['#E7FAFA', 'lightyellow', 'lightgreen', 'lightred'];
		
		this.rollUpRequest = function(request, templates) {
			if(!request) {
				return {
					"method": { "value": null },
					"protocol": { "value": null },
					"host": { "value": null },
					"port": { "value": null },
					"resource": { "value": null },
					"body": { "value": null },
					"headers": [],
					"querystring": []
				};
			}
			
			var rolledUpRequest = $.extend(true, {}, request);

			rolledUpRequest.method = { "value": null, "inheritedValue": null, "inheritedFrom": null, "bgcolor": null };
			rolledUpRequest.protocol = { "value": null, "inheritedValue": null, "inheritedFrom": null, "bgcolor": null };
			rolledUpRequest.host = { "value": null, "inheritedValue": null, "inheritedFrom": null, "bgcolor": null };
			rolledUpRequest.port = { "value": null, "inheritedValue": null, "inheritedFrom": null, "bgcolor": null };
			rolledUpRequest.resource = { "value": null, "inheritedValue": null, "inheritedFrom": null, "bgcolor": null };
			rolledUpRequest.body = { "value": null, "inheritedValue": null, "inheritedFrom": null, "bgcolor": null };

			if(rolledUpRequest.templates) {
				for(var i=0; i<rolledUpRequest.templates.length; i++) {
					var templateId = rolledUpRequest.templates[i];
					var template = null;
					//Find the template
					if(templates) {
						for(var j=0; j<templates.length; j++) {
							if(templates[j].id === templateId) {
								template = templates[j];
								break;
							}
						}
					}

					if(template != null) {
						if(template.method) {
							rolledUpRequest.method = { "value": template.method, "inheritedValue": template.method, "inheritedFrom": template.id, "bgcolor": _colors[i] };
						}
						if(template.protocol) {
							rolledUpRequest.protocol = { "value": template.protocol, "inheritedValue": template.protocol, "inheritedFrom": template.id, "bgcolor": _colors[i] };
						}
						if(template.host) {
							rolledUpRequest.host = { "value": template.host, "inheritedValue": template.host, "inheritedFrom": template.id, "bgcolor": _colors[i] };
						}
						if(template.port) {
							rolledUpRequest.port = { "value": template.port, "inheritedValue": template.port, "inheritedFrom": template.id, "bgcolor": _colors[i] };
						}
						if(template.resource) {
							rolledUpRequest.resource = { "value": template.resource, "inheritedValue": template.resource, "inheritedFrom": template.id, "bgcolor": _colors[i] };
						}
						if(template.body) {
							rolledUpRequest.body = { "value": template.body, "inheritedValue": template.body, "inheritedFrom": template.id, "bgcolor": _colors[i] };
						}
					}
				}
			}

			if(request.method) {
				rolledUpRequest.method.value = request.method;
			}
			if(request.protocol) {
				rolledUpRequest.protocol.value = request.protocol;
			}
			if(request.host) {
				rolledUpRequest.host.value = request.host;
			}
			if(request.port) {
				rolledUpRequest.port.value = request.port;
			}
			if(request.resource) {
				rolledUpRequest.resource.value = request.resource;
			}
			if(request.body) {
				rolledUpRequest.body.value = request.body;
			}

			return rolledUpRequest;
		};

		this.rollUpResponse = function(response, templates) {
			if(!response) {
				return {
					"statusCode": { "value": null },
					"body": { "value": null },
					"headers": []
				};
			}

			var rolledUpResponse = $.extend(true, {}, response);

			rolledUpResponse.statusCode = { "value": null, "inheritedValue": null, "inheritedFrom": null, "bgcolor": null };
			rolledUpResponse.body = { "value": null, "inheritedValue": null, "inheritedFrom": null, "bgcolor": null };

			if(rolledUpResponse.templates) {
				for(var i=0; i<rolledUpResponse.templates.length; i++) {
					var templateId = rolledUpResponse.templates[i];
					var template = null;
					//Find the template
					if(templates) {
						for(var j=0; j<templates.length; j++) {
							if(templates[j].id === templateId) {
								template = templates[j];
								break;
							}
						}
					}

					if(template != null) {
						if(template.statusCode) {
							rolledUpResponse.statusCode = { "value": template.statusCode, "inheritedValue": template.statusCode, "inheritedFrom": template.id, "bgcolor": _colors[i] };
						}
						if(template.body) {
							rolledUpResponse.body = { "value": template.body, "inheritedValue": template.body, "inheritedFrom": template.id, "bgcolor": _colors[i] };
						}
					}
				}
			}

			if(response.statusCode) {
				rolledUpResponse.statusCode = { "value": response.statusCode, "inheritedValue": null, "inheritedFrom": null, "bgcolor": null };
			}
			if(response.body) {
				rolledUpResponse.body = { "value": response.body, "inheritedValue": null, "inheritedFrom": null, "bgcolor": null };
			}

			return rolledUpResponse;
		};

	};

	return new constructor();
});


app.factory('RequestSvc', function() {

	var constructor = function() {
		var _self = this;
		this.currentRequest = {};
		this.changed = false;
		this.availableVariables = [];

		this.setRequestFromTemplate = function(template) {
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

			_self.currentRequest = request;
		};

		this.populateTemplateWithRequest = function(template) {
			if(_self.currentRequest.method.value)	template.method = _self.currentRequest.method.value;
			if(_self.currentRequest.protocol.value)	template.protocol = _self.currentRequest.protocol.value;
			if(_self.currentRequest.host.value)		template.host = _self.currentRequest.host.value;
			if(_self.currentRequest.port.value)		template.port = _self.currentRequest.port.value;
			if(_self.currentRequest.resource.value)	template.resource = _self.currentRequest.resource.value;
			if(_self.currentRequest.body.value)		template.body = _self.currentRequest.body.value;

			template.querystring = {};
			if(_self.currentRequest.querystring) {
				for(var i=0; i<_self.currentRequest.querystring.length; i++) {
					var querystring = _self.currentRequest.querystring[i];
					template.querystring[querystring.key] = querystring.value;
				}
			}
			template.headers = {};
			if(_self.currentRequest.headers) {
				for(var i=0; i<_self.currentRequest.headers.length; i++) {
					var header = _self.currentRequest.headers[i];
					template.headers[header.key] = header.value;
				}
			}

			if(_self.currentRequest.templates) {
				template.templates = _self.currentRequest.templates;
			}
		};

		this.addIfNew = function(templates, template) {
			//Look to see if this template is already stored
			var found = false;
			for(var i=0; i<templates.length; i++) {
				if(templates[i] == template) {
					found = true;
					break;
				}
			}

			if(!found) {
				templates.push(template);
			}
		};
	};
	
	return new constructor();
});

app.factory('ResponseSvc', function() {

	var constructor = function() {
		var _self = this;
		this.currentResponse = {};
		this.changed = false;
		this.availableVariables = [];

		this.setResponseFromTemplate = function(template) {
			var response = {};

			response.statusCode = { "value": template.statusCode };
			response.body = { "value": template.body };

			response.headers = [];
			if(template.headers) {
				for(var headerName in template.headers) {
					response.headers.push({
						"key": headerName,
						"value": template.headers[headerName]
					});
				}
			}

			_self.currentResponse = response;
		};

		this.populateTemplateWithResponse = function(template) {
			if(_self.currentResponse.statusCode.value)	template.statusCode = _self.currentResponse.statusCode.value;
			if(_self.currentResponse.body.value)		template.body = _self.currentResponse.body.value;

			template.headers = {};
			if(_self.currentResponse.headers) {
				for(var i=0; i<_self.currentResponse.headers.length; i++) {
					var header = _self.currentResponse.headers[i];
					template.headers[header.key] = header.value;
				}
			}

			if(_self.currentResponse.templates) {
				template.templates = _self.currentResponse.templates;
			}
		};

		this.addIfNew = function(templates, template) {
			//Look to see if this template is already stored
			var found = false;
			for(var i=0; i<templates.length; i++) {
				if(templates[i] == template) {
					found = true;
					break;
				}
			}

			if(!found) {
				templates.push(template);
			}
		};
	};

	return new constructor();
});
