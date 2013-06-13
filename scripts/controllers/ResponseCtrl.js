 

function ResponseCtrl($scope, ResponseSvc) {
	var _colors = ['#E7FAFA', 'lightyellow', 'lightgreen', 'lightred'];
	$scope.response = ResponseSvc.currentResponse;
	$scope.validjson = true;
	$scope.changed = false;


	$scope.getColor = function(index) {
		return _colors[index];
	}

	$scope.updateBgColor = function(field) {
		if(field.value == field.inheritedValue) {
			field.bgcolor = $scope.color[field.inheritedFrom] || '';
		}
		else {
			field.bgcolor = '';
		}
	}

	$scope.updateHeaderBgColor = function(field) {
		if(field.key == field.inheritedKey && field.value == field.inheritedValue) {
			field.bgcolor = $scope.color[field.inheritedFrom] || '';
		}
		else {
			field.bgcolor = '';
		}
	}


	$scope.addHeader = function() {
		if(!$scope.response.headers) $scope.response.headers = [];

		$scope.response.headers.push({'key': '', 'value': ''});
	}

	$scope.removeHeader = function(index) {
		$scope.response.headers.splice(index, 1);
	}

	$scope.formatBody = function() {
		$scope.response.body.value = beautify($scope.response.body.value);
	};

	$scope.updateModelWithBody = function(bodyText) {
		$scope.response.body.value = bodyText;
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
			document.getElementById('responseBody').style.height = (lineCount * 15) + 'px';
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

		editor = ace.edit("responseBody");
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
	wireupForm($scope, $scope.response.body.value, $scope.updateModelWithBody);

	//Assign template colors
	$scope.color = {};
	if($scope.response.templates) {
		for(var i=0; i<$scope.response.templates.length; i++) {
			$scope.color[$scope.response.templates[i]] = _colors[i];
		}
	}

}




