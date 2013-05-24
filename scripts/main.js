 
console.log('main loaded');
window.addEventListener('message', function(message) {
	console.log('The other page says hello ', message);

	var options = {
		type: 'openFile',
		accepts:[{
			extensions: ['html']
		}]
	};

//	var options = {type: 'saveFile', suggestedName: 'test'};

	window.chrome.fileSystem.chooseEntry(options, function(fileEntry) {
		if (!fileEntry) {
			sendMessage('fileOpenCanceled');
			return;
		}
		fileEntry.file(function(file) {
			var reader = new FileReader();
			reader.onload = function(e) {
				sendMessage('fileOpenSucceeded', e.target.result);
			};
			reader.readAsText(file);
		});
	});


});

function sendMessage(messageType, content) {
	var harveyFrame = document.getElementById('harveyFrame').contentWindow;
	harveyFrame.postMessage({"type": messageType, "content": content}, "*");
};