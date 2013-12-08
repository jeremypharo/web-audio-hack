BrowserEffectsPedal = function(audioElement) {
  this.audioElement = audioElement;
  this.context = new (window.AudioContext || window.webkitAudioContext);
  this.source = this.context.createMediaElementSource(audioElement);
};

BrowserEffectsPedal.prototype = {
  playWithEffects: function() {
    var gain = this.createGain();
    var filter = this.createFilter();
    var that = this;
    that.createConvolver(function(convolver) {
      that.createAudioGraph(gain, filter, convolver);
      that.addFilterContainer();
      that.addFilterSlider(filter);
      that.audioElement.play();
    });
  },

  createGain: function() {
    var gain = this.context.createGain();
    gain.gain.value = 0.8;

    return gain;
  },

  createFilter: function() {
    var filter = this.context.createBiquadFilter();
    filter.type = 0;
    filter.frequency.value = 440;
    filter.Q.value = 10;

    return filter;
  },

  createAudioGraph: function(gain, filter, convolver) {
    this.source.connect(gain);
    gain.connect(filter);
    filter.connect(convolver);
    convolver.connect(this.context.destination);
  },

  addFilterContainer: function() {
    container = document.createElement('div');
    container.id = 'filter-container';
    container.style.backgroundColor = '#DBDDDE';
    container.style.margin = '10px';

    document.body.appendChild(container);
  },

  addFilterSlider: function(filter) {
    slider = document.createElement('input');
    slider.type = "range";
    slider.oninput = function() { filter.frequency.value = this.value; };
    slider.min = "0";
    slider.max = "10000";
    slider.value = "100";
    slider.style.position = "fixed";
    slider.style.top = 0;
    slider.style.left = 0;
    slider.style.padding = '3px';
    slider.style.height = '1px';
    slider.style.margin = '10px';
    slider.style['-webkit-appearance'] = 'none';
    slider.style['-webkit-border-radius'] = '5px';
    slider.style.backgroundColor = '#E4B7F0';
    slider.style.border = '1px solid #999';
    slider.style.cursor = 'pointer';

    var filterContainer = document.getElementById('filter-container');
    filterContainer.appendChild(slider);
  },

  impulseResponseURL: "http://www.corsproxy.com/www.openairlib.net/sites/default/files/auralization/data/mrogalsky/elveden-hall-suffolk-england/stereo/1a_marble_hall.wav",

  createConvolver: function(callback) {
    var convolver = this.context.createConvolver();

    this.loadBuffer(this.impulseResponseURL, function(buffer) {
      convolver.buffer = buffer;

      callback(convolver);
    });
  },

  loadBuffer: function(url, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    var that = this;
    request.onload = function() {
      var buffer = that.context.createBuffer(request.response, false);
      callback(buffer);
    };
    request.send();
  }
};


var audioElement = document.getElementsByTagName('audio')[0];
var pedal = new BrowserEffectsPedal(audioElement);
pedal.playWithEffects();
