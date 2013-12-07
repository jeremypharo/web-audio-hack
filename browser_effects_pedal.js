BrowserEffectsPedal = function(audioElement) {
  this.audioElement = audioElement;
  this.context = new (window.AudioContext || window.webkitAudioContext);
  this.source = this.context.createMediaElementSource(audioElement);
};

BrowserEffectsPedal.prototype = {
  playWithEffects: function() {
    var filter = this.createFilter();
    this.createAudioGraph(filter);
    this.addFilterSlider(filter);
    this.audioElement.play();
  },

  createFilter: function() {
    var filter = this.context.createBiquadFilter();
    filter.type = 0;
    filter.frequency.value = 440;
    filter.Q.value = 15;

    return filter;
  },

  createAudioGraph: function(filter) {
    this.source.connect(filter);
    filter.connect(this.context.destination);
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
    document.body.appendChild(slider);
  }
};


var audioElement = document.getElementsByTagName('audio')[0];
var pedal = new BrowserEffectsPedal(audioElement);
pedal.playWithEffects();
