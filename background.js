/*
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.current('main.html', {
    'bounds': {
      'width': 400,
      'height': 500
    }
  });
});
*/
chrome.app.runtime.onLaunched.addListener(function() {
	window.open('main.html');
});