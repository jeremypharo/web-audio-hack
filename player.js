window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new AudioContext();

var soundSource;
var soundBuffer;
var url = 'full_techno_jacket_103_924.mp3';

function playAudioID(id) {
  var element = document.getElementById(id);
  var source = context.createMediaElementSource(element); // MediaElementAudioSourceNode, an AudioNode
  console.log(source.buffer);
  source.connect(context.destination);
  element.play();

  startSound();
}


function startSound() {
  // Note: this loads asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  // Our asynchronous callback
  request.onload = function() {
      var audioData = request.response;

      audioGraph(audioData);
  };

  request.send();
}

function playSound() {
  soundSource.noteOn(context.currentTime);
}

function stopSound() {
  soundSource.noteOff(context.currentTime);
}


function audioGraph(audioData) {
    var convolver;

    //Same setup as before
    soundSource = context.createBufferSource();
    soundBuffer = context.createBuffer(audioData, true);
    soundSource.buffer = soundBuffer;

    // Again, the context handles the difficult bits
    convolver = context.createConvolver();

    // Wiring
    soundSource.connect(convolver);
    convolver.connect(context.destination);

    // mine_site1_1way_bformat , dales_site3_4way_bformat, 1a_marble_hall 
    setReverbImpulseResponse('IR_Pink_Noise.wav', convolver, playSound);
}


function setReverbImpulseResponse(url, convolver, callback) {
    // As with the main sound source,
    // the Impulse Response loads asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function () {
        convolver.buffer = context.createBuffer(request.response, false);
        callback();
    }

	request.send();
}