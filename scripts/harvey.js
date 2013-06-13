
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

app.factory('NavigationSvc', function() {
	var constructor = function() {
		var _callback = null;
		var _navigationScope = null;
		var _self = this;

		this.view = null;

		this.navigate = function(view) {
			if(_callback) {
				_callback();
			}
			setTimeout(function() {
				_navigationScope.$apply(function() {
					_self.view = view;
				});
			}, 300);
			
		};

		this.setNavigateAwayCallback = function(callback) {
			_callback = callback;
		};

		this.setNavigationScope = function(navigationScope) {
			_navigationScope = navigationScope;
		};
	};

	return new constructor();
});
