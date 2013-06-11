
var app = angular.module('harvey', []);

app.factory('HarveyContext', function() {
	return {
		"data" : {},
		"filteredTests": [],
		"currentTest": {},
		"view": "Welcome",
		"upcomingView": "Welcome"
	};
});

function NavigationCtrl($scope, HarveyContext) {

	$scope.state = 'ready';
	$scope.context = HarveyContext;
	$scope.selectedMenu = 'tests';

	$scope.menuSelected  = function(menu, view) {
		$scope.selectedMenu = menu;
		$scope.context.upcomingView = view;
		
		setTimeout(function() {
			$scope.$apply(function() {
				$scope.context.view = view;
			});
		}, 300);
	};
}

function WelcomeCtrl($scope, HarveyContext) {

	$scope.state = 'ready';
	$scope.context = HarveyContext;

	$scope.openFile = function() {
	
		promptUserForFile(function(err, fileContents) {
			if(fileContents) {
				$scope.$apply(function(){
					//Update the tests that the TestList is pointing to
					HarveyContext.data = JSON.parse(fileContents);
					
					HarveyContext.filteredTests = HarveyContext.data.tests;
				});

				setTimeout(function() {
					$scope.$apply(function() {
						$scope.state = 'fading';
					});

					setTimeout(function() {
						$scope.$apply(function() {
							$scope.context.view = 'TestList';
						});
					}, 500);

				}, 100);
			}
		});
	};

	$scope.startFromScratch = function() {
		setTimeout(function() {
			$scope.$apply(function() {
				$scope.state = 'fading';
			});

			setTimeout(function() {
				$scope.$apply(function() {
					$scope.context.view = 'TestList';
				});
			}, 500);

		}, 100);
	};


	var promptUserForFile = function(callback) {

		parent.postMessage({"messageType": "openFile"}, '*');

		window.addEventListener('message', function(message) {
			if(message.data.type === 'fileOpenSucceeded') {
				callback(null, message.data.content);
			}
			else {
				callback(null, null);
			}
		});
		
	};
}

function TemplateListCtrl($scope, HarveyContext) {

	$scope.state = '';
	$scope.context = HarveyContext;
	$scope.filteredRequestTemplates = $scope.context.data.requestTemplates;
	$scope.filteredResponseTemplates = $scope.context.data.responseTemplates;
	$scope.searchString = "";

	$scope.$watch('context.upcomingView', function(newValue, oldValue) {
		if (newValue != 'TemplateList')
			$scope.state = 'fadingOut';
	});

	setTimeout(function() {
		$scope.$apply(function() {
			$scope.state = 'fadingIn';
		});
	}, 1);


	//Determine how many tests reference each template
	for(var i=0; i<$scope.filteredRequestTemplates.length; i++) {
		var template = $scope.filteredRequestTemplates[i];
		template.usedByCount = 0;
		
		for(var j=0; j<$scope.context.data.tests.length; j++) {
			var test = $scope.context.data.tests[j];
			if(test.request && test.request.templates && test.request.templates.indexOf(template.id) > -1) {
				template.usedByCount++;
			}
		}
	}
	for(var i=0; i<$scope.filteredResponseTemplates.length; i++) {
		var template = $scope.filteredResponseTemplates[i];
		template.usedByCount = 0;

		for(var j=0; j<$scope.context.data.tests.length; j++) {
			var test = $scope.context.data.tests[j];
			if(test.expectedResponse && test.expectedResponse.templates && test.expectedResponse.templates.indexOf(template.id) > -1) {
				template.usedByCount++;
			}
		}
	}
	

	$scope.filter = function() {
		var requestTemplates = [];
		var responseTemplates = [];

		if($scope.searchString === "") {
			requestTemplates = HarveyContext.data.requestTemplates;
			responseTemplates = HarveyContext.data.responseTemplates;
		}
		else {
			var tags = $scope.searchString.split(' ');
			requestTemplates = filterTemplates(HarveyContext.data.requestTemplates, tags);
			responseTemplates = filterTemplates(HarveyContext.data.responseTemplates, tags);
		}

		$scope.filteredRequestTemplates = requestTemplates;
		$scope.filteredResponseTemplates = responseTemplates;
	};

	var filterTemplates = function(templates, tags) {
		//Clone the tags array so we don't modify the original
		tags = tags.slice(0);
		
		if(!tags || tags.length == 0) return templates;

		var tag = tags.pop();
		var filteredTemplates = [];

		for(var i=0; i<templates.length; i++) {
			if(templates[i].id.toLowerCase().indexOf(tag.toLowerCase()) > -1) {
				filteredTemplates.push(templates[i]);
			}
		}

		return filterTemplates(filteredTemplates, tags);
	};

	$scope.deleteRequestTemplate = function(index) {
		var templateToDelete = $scope.filteredRequestTemplates[index];

		console.log('TODO: need to confirm the delete');
		if(true) {
			templateToDelete.deleting = true;

			setTimeout(function() {
				$scope.$apply(function() {
					//Remove the template from the filtered tests
					$scope.filteredRequestTemplates.splice(index, 1);

					//Find the test in the overall test list to remove it
					for(var i=0; i<$scope.context.data.requestTemplates.length; i++) {
						if(templateToDelete === $scope.context.data.requestTemplates[i]) {
							$scope.context.data.requestTemplates.splice(i, 1);
						}
					}
				});
			}, 500);
		}
	};

	$scope.deleteResponseTemplate = function(index) {
		var templateToDelete = $scope.filteredResponseTemplates[index];

		console.log('TODO: need to confirm the delete');
		if(true) {
			templateToDelete.deleting = true;

			setTimeout(function() {
				$scope.$apply(function() {
					//Remove the template from the filtered tests
					$scope.filteredResponseTemplates.splice(index, 1);

					//Find the test in the overall test list to remove it
					for(var i=0; i<$scope.context.data.responseTemplates.length; i++) {
						if(templateToDelete === $scope.context.data.responseTemplates[i]) {
							$scope.context.data.responseTemplates.splice(i, 1);
						}
					}
				});
			}, 500);
		}
	};


};


function TestListCtrl($scope, HarveyContext) {


	$scope.context = HarveyContext;
	$scope.filteredTests = $scope.context.data.tests;
	$scope.searchString = "";
	$scope.state = '';

	$scope.$watch('context.upcomingView', function(newValue, oldValue) {
		if (newValue != 'TestList')
			$scope.state = 'fadingOut';
	});

	setTimeout(function() {
		$scope.$apply(function() {
			$scope.state = 'fadingIn';
		});
	}, 1);

	$scope.filter = function() {
		var tests = [];

		if($scope.searchString === "") {
			tests = $scope.context.data.tests;
		}
		else {
			var tags = $scope.searchString.split(' ');
			tests = filterTests($scope.context.data.tests, tags);
		}

		$scope.filteredTests = tests;
	};

	var filterTests = function(tests, tags) {
		if(!tags || tags.length == 0) return tests;

		var tag = tags.pop();
		var filteredTests = [];

		for(var i=0; i<tests.length; i++) {
			if(tests[i].id.toLowerCase().indexOf(tag.toLowerCase()) > -1) {
				filteredTests.push(tests[i]);
			}
		}

		return filterTests(filteredTests, tags);
	};

	$scope.createTest = function() {
		console.log("new test clicked");
	};

	$scope.editTest = function(index) {
		$scope.context.currentTest = $scope.filteredTests[index];

		console.log('edit clicked for ' + $scope.context.currentTest.id);

		$scope.state = 'fadingOut';
		$scope.context.upcomingView = 'Test';
		setTimeout(function() {
			$scope.$apply(function() {
				$scope.context.view = 'Test';
			});
		}, 500);
	};

	$scope.deleteTest = function(index) {
		var testToDelete = $scope.filteredTests[index];

		console.log('TODO: need to confirm the delete');
		//if(confirm("Are you sure you want to delete test '" + testToDelete.id + "'?")) {
		if(true) {
			testToDelete.deleting = true;

			setTimeout(function() {
				$scope.$apply(function() {
					//Remove the test from the filtered tests
					$scope.filteredTests.splice(index, 1);

					//Find the test in the overall test list to remove it
					for(var i=0; i<$scope.context.data.tests.length; i++) {
						if(testToDelete === $scope.context.data.tests[i]) {
							$scope.context.data.tests.splice(i, 1);
						}
					}
				});
			}, 500);
		}
	};

}

function HelperListCtrl($scope, HarveyContext) {

	$scope.state = '';
	$scope.context = HarveyContext;
	$scope.filteredHelpers = $scope.context.data.setupAndTeardowns;
	$scope.searchString = "";

	$scope.$watch('context.upcomingView', function(newValue, oldValue) {
		if (newValue != 'HelperList')
			$scope.state = 'fadingOut';
	});

	setTimeout(function() {
		$scope.$apply(function() {
			$scope.state = 'fadingIn';
		});
	}, 1);

	//Determine how many tests reference each template
	for(var i=0; i<$scope.filteredHelpers.length; i++) {
		var helper = $scope.filteredHelpers[i];
		helper.usedByCount = 0;

		for(var j=0; j<$scope.context.data.tests.length; j++) {
			var test = $scope.context.data.tests[j];
			if((test.setup && test.setup.indexOf(helper.id) > -1)
				|| (test.teardown && test.teardown.indexOf(helper.id) > -1)) {
				helper.usedByCount++;
			}
		}
	}

	$scope.filter = function() {
		var helpers = [];

		if($scope.searchString === "") {
			helpers = $scope.context.data.setupAndTeardowns;
		}
		else {
			var tags = $scope.searchString.split(' ');
			helpers = filterHelpers($scope.context.data.setupAndTeardowns, tags);
		}

		$scope.filteredHelpers = helpers;
	};

	var filterHelpers = function(helpers, tags) {
		//Clone the tags array so we don't modify the original
		tags = tags.slice(0);

		if(!tags || tags.length == 0) return helpers;

		var tag = tags.pop();
		var filteredHelpers = [];

		for(var i=0; i<helpers.length; i++) {
			if(helpers[i].id.toLowerCase().indexOf(tag.toLowerCase()) > -1) {
				filteredHelpers.push(helpers[i]);
			}
		}

		return filterHelpers(filteredHelpers, tags);
	};
	
	$scope.deleteHelper = function(index) {
		var helperToDelete = $scope.filteredHelpers[index];

		console.log('TODO: need to confirm the delete');
		//if(confirm("Are you sure you want to delete test '" + testToDelete.id + "'?")) {
		if(true) {
			helperToDelete.deleting = true;

			setTimeout(function() {
				$scope.$apply(function() {
					//Remove the test from the filtered tests
					$scope.filteredHelpers.splice(index, 1);

					//Find the test in the overall test list to remove it
					for(var i=0; i<$scope.context.data.setupAndTeardowns.length; i++) {
						if(helperToDelete === $scope.context.data.setupAndTeardowns[i]) {
							$scope.context.data.setupAndTeardowns.splice(i, 1);
						}
					}
				});
			}, 500);
		}
	};

};


function TestCtrl($scope, HarveyContext) {
	var _colors = ['lightblue', 'lightyellow', 'lightgreen', 'lightred'];
	$scope.context = HarveyContext;
	$scope.state = '';

	$scope.$watch('context.upcomingView', function(newValue, oldValue) {
		if (newValue != 'Test')
			$scope.state = 'fadingOut';
	});
	
	setTimeout(function() {
		$scope.$apply(function() {
			$scope.state = 'fadingIn';
			console.log('now');
		});
	}, 1);



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
		if(!$scope.currentTest.request.headers) $scope.currentTest.request.headers = [];

		$scope.currentTest.request.headers.push({'key': '', 'value': ''});
	}

	$scope.removeHeader = function(index) {
		$scope.currentTest.request.headers.splice(index, 1);
	}

	$scope.addQuerystring = function() {
		if(!$scope.currentTest.request.querystring) $scope.currentTest.request.querystring = [];

		$scope.currentTest.request.querystring.push({'key': '', 'value': ''});
	}

	$scope.removeQuerystring = function(index) {
		delete $scope.currentTest.request.querystring.splice(index, 1);
	}

	$scope.updateModelWithBody = function(bodyText) {
		$scope.currentTest.request.body = bodyText;
	}


	var rollupTest = function(test, testSuite) {
		var rolledUpTest = $.extend(true, {}, test);
		
		rolledUpTest.request.method = { "value": null, "inheritedValue": null, "inheritedFrom": null, "bgcolor": "transparent" };
		rolledUpTest.request.protocol = { "value": null, "inheritedValue": null, "inheritedFrom": null, "bgcolor": "transparent" };
		rolledUpTest.request.host = { "value": null, "inheritedValue": null, "inheritedFrom": null, "bgcolor": "transparent" };
		rolledUpTest.request.resource = { "value": null, "inheritedValue": null, "inheritedFrom": null, "bgcolor": "transparent" };

		if(test.request.templates) {
			for(var i=0; i<test.request.templates.length; i++) {
				var templateId = test.request.templates[i];
				var template = null;
				//Find the template
				if(testSuite.requestTemplates) {
					for(var j=0; j<testSuite.requestTemplates.length; j++) {
						if(testSuite.requestTemplates[j].id === templateId) {
							template = testSuite.requestTemplates[j];
							break;
						}
					}
				}

				if(template != null) {
					if(template.method) {
						rolledUpTest.request.method.value = template.method;
						rolledUpTest.request.method.inheritedValue = template.method;
						rolledUpTest.request.method.inheritedFrom = template.id;
						rolledUpTest.request.method.bgcolor = _colors[i];
					}
					if(template.protocol) {
						rolledUpTest.request.protocol.value = template.protocol;
						rolledUpTest.request.protocol.inheritedValue = template.protocol;
						rolledUpTest.request.protocol.inheritedFrom = template.id;
						rolledUpTest.request.protocol.bgcolor = _colors[i];
					}
					if(template.host) {
						rolledUpTest.request.host.value = template.host;
						rolledUpTest.request.host.inheritedValue = template.host;
						rolledUpTest.request.host.inheritedFrom = template.id;
						rolledUpTest.request.host.bgcolor = _colors[i];
					}
					if(template.resource) {
						rolledUpTest.request.resource.value = template.resource;
						rolledUpTest.request.resource.inheritedValue = template.resource;
						rolledUpTest.request.resource.inheritedFrom = template.id;
						rolledUpTest.request.resource.bgcolor = _colors[i];
					}
				}
			}
		}

		if(test.request.method) {
			rolledUpTest.request.method = { "value": test.request.method, "inheritedValue": null, "inheritedFrom": null, "bgcolor": "transparent" };
		}
		if(test.request.protocol) {
			rolledUpTest.request.protocol = { "value": test.request.protocol, "inheritedValue": null, "inheritedFrom": null, "bgcolor": "transparent" };
		}
		if(test.request.host) {
			rolledUpTest.request.host = { "value": test.request.host, "inheritedValue": null, "inheritedFrom": null, "bgcolor": "transparent" };
		}
		if(test.request.resource) {
			rolledUpTest.request.resource = { "value": test.request.resource, "inheritedValue": null, "inheritedFrom": null, "bgcolor": "transparent" };
		}

		return rolledUpTest;
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
	}
	
	var editor;

	var wireupForm = function($scope, bodyText, bodyCallback) {

		if(_.isObject(bodyText)) bodyText = js_beautify(JSON.stringify(bodyText));

		$('#resource').typeahead({
			"source": ["courseId", "courseItemId", "userId", "gradeId"],
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

		editor.getSession().on('change', function(e) {
			//Save the content
			bodyCallback(editor.getValue());

			//Set the editor height
			var lineCount = editor.session.getLength();
			if(lineCount < 5) lineCount = 5;
			document.getElementById('requestBody').style.height = (lineCount * 15) + 'px';;
			editor.resize();

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

		editor.setValue(bodyText);

	}

	$scope.currentTest = rollupTest($scope.context.currentTest, $scope.context.data);
	wireupForm($scope, $scope.currentTest.request.body, $scope.updateModelWithBody);

	//Assign template colors
	$scope.color = {};
	for(var i=0; i<$scope.currentTest.request.templates.length; i++) {
		$scope.color[$scope.currentTest.request.templates[i]] = _colors[i];
	}


}


