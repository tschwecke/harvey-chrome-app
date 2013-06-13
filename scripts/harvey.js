
var app = angular.module('harvey', []);

app.factory('HarveyContext', function() {
	return {
		"data" : {},
		"filteredTests": [],
		"currentTest": {},
		"currentRequestTemplate": {},
		"view": "Welcome",
		"upcomingView": "Welcome"
	};
});

app.factory('RequestContext', function() {
	return {
		"currentRequest" : {},
		"changed": false,
		"availableVariables": []
	};
});
