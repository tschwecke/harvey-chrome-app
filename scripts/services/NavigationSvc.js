app.factory('NavigationSvc', function() {
	var constructor = function() {
		var _navigateAwayCallback = null;
		var _showWelcomeCallback = null;
		var _navigationScope = null;
		var _self = this;

		this.view = null;

		this.navigate = function(view) {
			if(view !== _self.view) {
				if(_navigateAwayCallback) {
					_navigateAwayCallback();
				}

				if(view == 'Welcome') {
					if(_showWelcomeCallback) {
						_self.view = view;
						_showWelcomeCallback();
					}
				}
				else {
					setTimeout(function() {
						_navigationScope.$apply(function() {
							_self.view = view;
						});
					}, 300);
				}
			}
		};


		this.setNavigateAwayCallback = function(callback) {
			_navigateAwayCallback = callback;
		};

		this.setShowWelcomeCallback = function(callback) {
			_showWelcomeCallback = callback;
		};

		this.setNavigationScope = function(navigationScope) {
			_navigationScope = navigationScope;
		};
	};

	return new constructor();
});



 
