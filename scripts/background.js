
chrome.app.runtime.onLaunched.addListener(function() {
 chrome.app.window.create('harvey.html', {
    'bounds': {
      'width': 1300,
      'height': 800
    }
  });
});
