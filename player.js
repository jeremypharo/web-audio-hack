window.AudioContext = window.AudioContext || window.webkitAudioContext;

function playAudioID(id) {
  var context = new AudioContext;
  var element = document.getElementById(id);
  var source = context.createMediaElementSource(element);
  source.connect(context.destination);
  element.play();
}
