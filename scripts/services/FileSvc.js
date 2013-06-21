app.factory('FileSvc', function() {
	var constructor = function() {
		var _currentFileEntry = null;

		this.open = function(callback) {
			var options = {type: 'openWritableFile',accepts:[{extensions: ['json']}]};

			window.chrome.fileSystem.chooseEntry(options, function(fileEntry) {
				if (!fileEntry) {
					callback(null, null);
					return;
				}
				_currentFileEntry = fileEntry;
				fileEntry.file(function(file) {
					var reader = new FileReader();
					reader.onload = function(e) {
						callback(null, e.target.result);
					};
					reader.readAsText(file);
				});
			});
		};
		
		this.save = function(content) {
			prepContentForSave(content);
			
			if(_currentFileEntry) {
				saveContent(_currentFileEntry, message.data.content);
			}
			else {
				var options = {type: 'saveFile',accepts:[{extensions: ['json']}]};

				window.chrome.fileSystem.chooseEntry(options, function(fileEntry) {
					if (!fileEntry) {
						sendMessage('fileSaveCanceled');
						return;
					}
					_currentFileEntry = fileEntry;
					saveContent(fileEntry, message.data.content);
				});
			}
		};

		this.clear = function() {
			parent.postMessage({"messageType": "clearFile"}, '*');
		};

		function saveContent(fileEntry, content) {
			fileEntry.createWriter(function(fileWriter) {
				fileWriter.onwrite = function(e) {
					fileWriter.truncate(content.length);
				};

				var blob = new Blob([content], {type: 'text/plain'});
				fileWriter.write(blob);
			});
		}

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