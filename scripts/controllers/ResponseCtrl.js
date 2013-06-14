 

function ResponseCtrl($scope, HarveyContext, ResponseSvc) {
	var _colors = ['#E7FAFA', 'lightyellow', 'lightgreen', 'red'];
	$scope.response = ResponseSvc.currentResponse;
	$scope.validjson = true;
	$scope.changed = false;


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
			var newTemplateId = $('#newResponseTemplateId').val();
			$scope.response.templates.push(newTemplateId);
			$scope.newTemplateId = '';
		}

		$scope.showAddResponseTemplate = false;
	};
	
	$scope.removeTemplate = function(index) {
		delete $scope.response.templates.splice(index, 1);

		assignTemplateColors();
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

		var templateIds = [];
		for(var i=0; i<HarveyContext.data.responseTemplates.length; i++) {
			templateIds.push(HarveyContext.data.responseTemplates[i].id);
		}

		$('#newResponseTemplateId').typeahead({
			"source": templateIds
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
	var assignTemplateColors = function() {
		$scope.color = {};
		if($scope.response.templates) {
			for(var i=0; i<$scope.response.templates.length; i++) {
				$scope.color[$scope.response.templates[i]] = _colors[i];
			}
		}
	};
	assignTemplateColors();

}




