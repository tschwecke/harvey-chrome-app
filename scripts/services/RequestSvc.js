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
 
