
chrome.app.runtime.onLaunched.addListener(function() {
 chrome.app.window.create('main.html', {
    'bounds': {
      'width': 1500,
      'height': 1000
    }
  });
});
/*
console.log('In here');

chrome.app.runtime.onLaunched.addListener(function() {
	window.open('harvey.html');
});

window.addEventListener('message', function(e) {
	console.log('The other page says hello ', e.data);

	var options = {
		type: 'openFile',
		accepts:[{
			extensions: ['html']
		}]
	};

//	var options = {type: 'saveFile', suggestedName: 'test'};

	window.chrome.fileSystem.chooseEntry(options, function(fileEntry) {
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

*/