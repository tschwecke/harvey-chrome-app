app.factory('FileSvc', function() {
	var constructor = function() {
		var _navigateAwayCallback = null;

		this.open = function(callback) {
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
		
		this.save = function(content) {
			prepContentForSave(content);
			
			parent.postMessage({"messageType": "save", "content": js_beautify(JSON.stringify(content))}, '*');
		};

		this.clear = function() {
			parent.postMessage({"messageType": "clearFile"}, '*');
		};
	};

	return new constructor();
});
 

var badProperties = ['$$hashKey'];

function prepContentForSave(content) {
	if(_.isObject(content)) {
		for(var propName in content) {
			if(badProperties.indexOf(propName) > -1) {
				delete content[propName];
			}
			else {
				prepContentForSave(content[propName]);
			}
		}
	}
	else if(_.isArray(content)) {
		for(var i=0; i<content.length; i++) {
			prepContentForSave(content[i]);
		}
	}
}