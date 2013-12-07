// Fix up prefixing
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

function loadDavidRocking(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      callback(buffer);
    });
  }
  request.send();
}
