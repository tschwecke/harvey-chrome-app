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
 
