var currentFileEntry = null; 

window.addEventListener('message', function(message) {
	
	switch(message.data.messageType) {
		case 'openFile':
			var options = {type: 'openWritableFile',accepts:[{extensions: ['json']}]};

			window.chrome.fileSystem.chooseEntry(options, function(fileEntry) {
				if (!fileEntry) {
					sendMessage('fileOpenCanceled');
					return;
				}
				currentFileEntry = fileEntry;
				fileEntry.file(function(file) {
					var reader = new FileReader();
					reader.onload = function(e) {
						sendMessage('fileOpenSucceeded', e.target.result);
					};
					reader.readAsText(file);
				});
			});
			break;

		case 'save':
				saveContent(currentFileEntry, message.data.content);
			break;

		case 'saveAs':
			var options = {type: 'saveFile',accepts:[{extensions: ['json']}]};

			window.chrome.fileSystem.chooseEntry(options, function(fileEntry) {
				if (!fileEntry) {
					sendMessage('fileSaveAsCanceled');
					return;
				}
				currentFileEntry = fileEntry;
				saveContent(fileEntry, message.data.content);
			});
			break;
	}




});

function sendMessage(messageType, content) {
	var harveyFrame = document.getElementById('harveyFrame').contentWindow;
	harveyFrame.postMessage({"type": messageType, "content": content}, "*");
}

function saveContent(fileEntry, content) {
	fileEntry.createWriter(function(fileWriter) {

		var blob = new Blob([content], {type: 'text/plain'});
		fileWriter.write(blob);
	});
}
