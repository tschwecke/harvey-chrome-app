
chrome.app.runtime.onLaunched.addListener(function() {
 chrome.app.window.create('main.html', {
    'bounds': {
      'width': 1300,
      'height': 800
    }
  });
});
