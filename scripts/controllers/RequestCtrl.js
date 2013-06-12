
function RequestCtrl($scope, RequestContext) {
	var _colors = ['#E7FAFA', 'lightyellow', 'lightgreen', 'lightred'];
	$scope.request = RequestContext.currentRequest;
	$scope.validjson = true;


	$scope.getColor = function(index) {
		return _colors[index];
	}

	$scope.updateBgColor = function(field) {
		if(field.value == field.inheritedValue) {
			field.bgcolor = $scope.color[field.inheritedFrom] || transparent;
		}
		else {
			field.bgcolor = 'transparent';
		}
	}

	$scope.updateHeaderBgColor = function(field) {
		if(field.key == field.inheritedKey && field.value == field.inheritedValue) {
			field.bgcolor = $scope.color[field.inheritedFrom] || transparent;
		}
		else {
			field.bgcolor = 'transparent';
		}
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
		$scope.request.body = beautify($scope.request.body);
	};

	$scope.updateModelWithBody = function(bodyText) {
		$scope.request.body = bodyText;
	}

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

	var wireupForm = function($scope, bodyText, bodyCallback) {

		if(_.isObject(bodyText)) bodyText = js_beautify(JSON.stringify(bodyText));

		$('#resource').typeahead({
			"source": $scope.availableVariables,
			"matcher": function(item) {
				var cursorPosition = doGetCaretPosition(document.getElementById('resource'));
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
				var cursorPosition = doGetCaretPosition(document.getElementById('resource'));
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
	wireupForm($scope, $scope.request.body, $scope.updateModelWithBody);

	//Assign template colors
	$scope.color = {};
	if($scope.request.templates) {
		for(var i=0; i<$scope.request.templates.length; i++) {
			$scope.color[$scope.request.templates[i]] = _colors[i];
		}
	}

}



 
