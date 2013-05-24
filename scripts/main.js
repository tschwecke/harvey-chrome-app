 
console.log('main loaded');
window.addEventListener('message', function(e) {
	console.log('The other page says hello ', e.data);

	var options = {
		type: 'openFile',
		accepts:[{
			extensions: ['html']
		}]
	};

//	var options = {type: 'saveFile', suggestedName: 'test'};

	chrome.fileSystem.chooseEntry(options, function(fileEntry) {
		if (!fileEntry) {
			console.log("User did not select a file");
			return;
		}
		fileEntry.file(function(file) {
			var reader = new FileReader();
			reader.onload = function(e) {
				console.log('file contents' + e.target.result);
			};
			reader.readAsText(file);
		});
	});


});