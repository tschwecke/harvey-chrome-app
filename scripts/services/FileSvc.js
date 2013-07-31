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
			content = convertToString(content);
			
			if(_currentFileEntry) {
				saveContent(_currentFileEntry, content);
			}
			else {
				var options = {type: 'saveFile',accepts:[{extensions: ['json']}]};

				window.chrome.fileSystem.chooseEntry(options, function(fileEntry) {
					if (!fileEntry) {
						return;
					}
					_currentFileEntry = fileEntry;
					saveContent(fileEntry, content);
				});
			}
		};

		this.clear = function() {
			_currentFileEntry = null;
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
 

var badProperties = ['$$hashKey', "usedByCount"];

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

function convertToString(json) {
	return js_beautify(JSON.stringify(json));
}
