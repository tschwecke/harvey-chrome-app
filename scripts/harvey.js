
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
