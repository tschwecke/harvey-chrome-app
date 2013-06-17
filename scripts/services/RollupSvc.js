app.factory('RollupSvc', function() {
	var constructor = function() {

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

			rolledUpRequest.method = { "value": null, "inheritedValue": null, "inheritedFrom": null };
			rolledUpRequest.protocol = { "value": null, "inheritedValue": null, "inheritedFrom": null };
			rolledUpRequest.host = { "value": null, "inheritedValue": null, "inheritedFrom": null };
			rolledUpRequest.port = { "value": null, "inheritedValue": null, "inheritedFrom": null };
			rolledUpRequest.resource = { "value": null, "inheritedValue": null, "inheritedFrom": null };
			rolledUpRequest.body = { "value": null, "inheritedValue": null, "inheritedFrom": null };
			rolledUpHeaders = {};
			rolledUpQuerystring = {};

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
							rolledUpRequest.method = { "value": template.method, "inheritedValue": template.method, "inheritedFrom": template.id };
						}
						if(template.protocol) {
							rolledUpRequest.protocol = { "value": template.protocol, "inheritedValue": template.protocol, "inheritedFrom": template.id };
						}
						if(template.host) {
							rolledUpRequest.host = { "value": template.host, "inheritedValue": template.host, "inheritedFrom": template.id };
						}
						if(template.port) {
							rolledUpRequest.port = { "value": template.port, "inheritedValue": template.port, "inheritedFrom": template.id };
						}
						if(template.resource) {
							rolledUpRequest.resource = { "value": template.resource, "inheritedValue": template.resource, "inheritedFrom": template.id };
						}
						if(template.body) {
							rolledUpRequest.body = { "value": template.body, "inheritedValue": template.body, "inheritedFrom": template.id };
						}

						if(template.headers) {
							for(var headerName in template.headers) {
								rolledUpHeaders[headerName] = { "key": headerName, "value": template.headers[headerName], "inheritedKey": headerName, "inheritedValue": template.headers[headerName], "inheritedFrom": template.id };
							}
						}

						if(template.querystring) {
							for(var qsName in template.querystring) {
								rolledUpQuerystring[qsName] = { "key": qsName, "value": template.querystring[qsName], "inheritedKey": qsName, "inheritedValue": template.querystring[qsName], "inheritedFrom": template.id };
							}
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
			if(request.headers) {
				for(var headerName in request.headers) {
					if(rolledUpHeaders[headerName]) {
						rolledUpHeaders[headerName].value = request.headers[headerName];
					}
					else {
						rolledUpHeaders[headerName] = { "key": headerName, "value": request.headers[headerName], "inheritedKey": null, "inheritedValue": null, "inheritedFrom": null };
					}
				}
			}
			if(request.querystring) {
				for(var qsName in request.querystring) {
					if(rolledUpHeaders[qsName]) {
						rolledUpHeaders[qsName].value = request.querystring[qsName];
					}
					else {
						rolledUpHeaders[qsName] = { "key": qsName, "value": request.querystring[qsName], "inheritedKey": null, "inheritedValue": null, "inheritedFrom": null };
					}
				}
			}

			rolledUpRequest.headers = [];
			for(var headerName in rolledUpHeaders) {
				rolledUpRequest.headers.push(rolledUpHeaders[headerName]);
			}
			rolledUpRequest.querystring = [];
			for(var qsName in rolledUpQuerystring) {
				rolledUpRequest.querystring.push(rolledUpQuerystring[qsName]);
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

			rolledUpResponse.statusCode = { "value": null, "inheritedValue": null, "inheritedFrom": null };
			rolledUpResponse.body = { "value": null, "inheritedValue": null, "inheritedFrom": null };
			rolledUpHeaders = {};

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
							rolledUpResponse.statusCode = { "value": template.statusCode, "inheritedValue": template.statusCode, "inheritedFrom": template.id };
						}
						if(template.body) {
							rolledUpResponse.body = { "value": template.body, "inheritedValue": template.body, "inheritedFrom": template.id };
						}
						if(template.headers) {
							for(var headerName in template.headers) {
								rolledUpHeaders[headerName] = { "key": headerName, "value": template.headers[headerName], "inheritedKey": headerName, "inheritedValue": template.headers[headerName], "inheritedFrom": template.id };
							}
						}
					}
				}
			}

			if(response.statusCode) {
				rolledUpResponse.statusCode.value = response.statusCode;
			}
			if(response.body) {
				rolledUpResponse.body.value= response.body;
			}
			if(response.headers) {
				for(var headerName in response.headers) {
					if(rolledUpHeaders[headerName]) {
						rolledUpHeaders[headerName].value = response.headers[headerName];
					}
					else {
						rolledUpHeaders[headerName] = { "key": headerName, "value": response.headers[headerName], "inheritedKey": null, "inheritedValue": null, "inheritedFrom": null };
					}
				}
			}

			rolledUpResponse.headers = [];
			for(var headerName in rolledUpHeaders) {
				rolledUpResponse.headers.push(rolledUpHeaders[headerName]);
			}

			return rolledUpResponse;
		};

	};

	return new constructor();
});

 
