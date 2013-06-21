
function RequestCtrl($scope, HarveyContext, RequestSvc) {
	var _colors = ['#E7FAFA', '#D0E1F0', '#B9C8E7', '#A2AFDD', '#8B96D3'];
	$scope.request = RequestSvc.currentRequest;
	$scope.validjson = true;
	$scope.changed = false;
	$scope.methodEmpty = !$scope.request.method.value;
	$scope.methodPlaceholder = $scope.methodEmpty ? 'Method' : '';
	$scope.protocolEmpty = !$scope.request.protocol.value;
	$scope.protocolPlaceholder = $scope.protocolEmpty ? 'Protocol' : '';
	$scope.displayTemplates = getDisplayTemplates($scope);

	$scope.getColor = function(index) {
		return _colors[index];
	}

	$scope.getBgColor = function(field) {
		var bgcolor = '';
		if(field.value == field.inheritedValue) {
			bgcolor = $scope.color[field.inheritedFrom] || '';
		}

		return bgcolor;
	}

	$scope.getHeaderBgColor = function(field) {
		var bgcolor = '';
		if(field.key == field.inheritedKey && field.value == field.inheritedValue) {
			bgcolor = $scope.color[field.inheritedFrom] || '';
		}

		return bgcolor;
	}

	//Need to do this workaround since angular doesn't support keypresses very well
	$(document).keypress(function(e) {
		if(e.which == 13) {
			$scope.$apply(function() {
				$scope.addTemplate();
			});
		}
	});
	
	$scope.addTemplate = function() {
		if($scope.newTemplateId) {
			//Need to do this workaround for getting the value since angular and the bootstrap typeahead don't mix well
			var newTemplateId = $('#newRequestTemplateId').val();
			$scope.request.templates.push(newTemplateId);
			$scope.newTemplateId = '';
		}
		
		$scope.showAddRequestTemplate = false;
	};

	$scope.removeTemplate = function(index) {
		delete $scope.request.templates.splice(index, 1);

		assignTemplateColors();
	}

	$scope.addHeader = function() {
		if(!$scope.request.headers) $scope.request.headers = [];

		$scope.request.headers.push({'key': '', 'value': ''});
	}

	$scope.removeHeader = function(index) {
		$scope.request.headers.splice(index, 1);
	}

	$scope.addQuerystring = function() {
		if(!$scope.request.querystring) $scope.request.querystring = [];

		$scope.request.querystring.push({'key': '', 'value': ''});
	}

	$scope.removeQuerystring = function(index) {
		delete $scope.request.querystring.splice(index, 1);
	}

	$scope.formatBody = function() {
		$scope.request.body.value = beautify($scope.request.body.value);
	};

	$scope.updateModelWithBody = function(bodyText) {
		$scope.request.body.value = bodyText;
	}

	$scope.methodChanged = function() {
		$scope.methodEmpty = !$scope.request.method.value;
		$scope.methodPlaceholder = $scope.methodEmpty ? 'Method' : '';
	};

	$scope.protocolChanged = function() {
		$scope.protocolEmpty = !$scope.request.protocol.value;
		$scope.protocolPlaceholder = $scope.protocolEmpty ? 'Protocol' : '';
	};


	var doGetCaretPosition = function(ctrl) {
		var CaretPos = 0;
		// IE Support
		if (document.selection) {
			ctrl.focus ();
			var Sel = document.selection.createRange ();
			Sel.moveStart ('character', -ctrl.value.length);
			CaretPos = Sel.text.length;
		}
		// Firefox support
		else if (ctrl.selectionStart || ctrl.selectionStart == '0')
			CaretPos = ctrl.selectionStart;
		return (CaretPos);
	}

	var beautify = function() {
		editor.setValue(js_beautify(editor.getValue()));
		editor.clearSelection();
	}

	var editor;

	var setEditorHeight = function(editor) {
			var lineCount = editor.session.getLength();
			if(lineCount < 5) lineCount = 5;
			document.getElementById('requestBody').style.height = (lineCount * 15) + 'px';
			editor.resize();
	};

	var wireupForm = function($scope, bodyText, bodyCallback, RequestSvc) {

		if(_.isObject(bodyText)) bodyText = js_beautify(JSON.stringify(bodyText));

		var templateIds = [];
		for(var i=0; i<HarveyContext.data.requestTemplates.length; i++) {
			templateIds.push(HarveyContext.data.requestTemplates[i].id);
		}
		
		$('#newRequestTemplateId').typeahead({
			"source": templateIds,
			"items": 15,
			"sorter": function(items) {
				return items.sort();
			}
		});

		$('#resource, #host, .header-value, .qs-value').typeahead({
			"source": RequestSvc.availableVariables,
			"items": 15,
			"sorter": function(items) {
				return items.sort();
			},
			"matcher": function(item) {
				var cursorPosition = doGetCaretPosition(document.getElementById(this.$element.context.id));
				var braceOpenPosition = this.query.lastIndexOf('${', cursorPosition);
				var braceClosedPosition = this.query.lastIndexOf('}', cursorPosition);
				if(cursorPosition>= 2 && braceOpenPosition > -1 && braceOpenPosition > braceClosedPosition) {
					var partialVarName = this.query.substring(braceOpenPosition + 2, cursorPosition);

					if(partialVarName === "" || item.indexOf(partialVarName) === 0) {
						return true;
					}
				}

				return false;
			},
			"updater": function(item) {
				var cursorPosition = doGetCaretPosition(document.getElementById(this.$element.context.id));
				var braceOpenPosition = this.query.lastIndexOf('${', cursorPosition);
				var braceClosedPosition = this.query.indexOf('}', cursorPosition);
				var nextBraceOpenPosition = this.query.indexOf('${', cursorPosition);
				if(nextBraceOpenPosition === -1) nextBraceOpenPosition = 99999999;
				var endPosition = (braceClosedPosition !== -1 && braceClosedPosition < nextBraceOpenPosition) ? braceClosedPosition + 1 : cursorPosition;
				var preString = this.query.substr(0, braceOpenPosition);
				var postString = this.query.substr(endPosition);
				var updatedText = preString + '${' + item + '}' + postString;
				return updatedText;
			}
		});

		editor = ace.edit("requestBody");
		//editor.setReadOnly(true);
		editor.renderer.setShowGutter(false);
		editor.setHighlightActiveLine(false);
		editor.setTheme("ace/theme/clouds");
		editor.getSession().setMode("ace/mode/json");
		editor.setValue(bodyText);
		editor.clearSelection();
		setEditorHeight(editor);

		editor.getSession().on('change', function(e) {
			//Save the content
			bodyCallback(editor.getValue());

			//Set the editor height
			setEditorHeight(editor);

			$scope.$apply(function() {
				//Determine if the current content is valid
				var text = editor.getValue();
				$scope.validjson = true;
				try {
					JSON.parse(text);
				}
				catch(error) {
					$scope.validjson = false;
				}
			});
		});


	}
	wireupForm($scope, $scope.request.body.value, $scope.updateModelWithBody, RequestSvc);

	//Assign template colors
	var assignTemplateColors = function() {
		$scope.color = {};
		if($scope.request.templates) {
			for(var i=0; i<$scope.request.templates.length; i++) {
				$scope.color[$scope.request.templates[i]] = _colors[i];
			}
		}
	};
	assignTemplateColors();

}




var getDisplayTemplates = function($scope) {
	if($scope.$parent && $scope.$parent.hasOwnProperty('displayTemplates')) {
		return $scope.$parent.displayTemplates;
	}
	else if($scope.$parent && $scope.$parent.$parent && $scope.$parent.$parent.hasOwnProperty('displayTemplates')) {
		return $scope.$parent.$parent.displayTemplates;
	}
	else {
		return true;
	}
};
 
