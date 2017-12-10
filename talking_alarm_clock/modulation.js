window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new AudioContext();

function playSound(arr) {
  var buf = new Float32Array(arr.length)
  for (var i = 0; i < arr.length; i++) buf[i] = arr[i]
  var buffer = context.createBuffer(1, buf.length, context.sampleRate)
  buffer.copyToChannel(buf, 0)
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
}

function khz2hz(khz) {
  return 1000 * khz;
}

function sineWaveAt(sampleNumber, tone) {
  var sampleFreq = context.sampleRate / tone
  return Math.sin(sampleNumber / (sampleFreq / (Math.PI*2)))
}

function getCustomSine(volume, length, tone) {
  var arr = []
  //volume = 0.2, seconds = 0.5, tone = khz2hz(24);

  for (var i = 0; i < length; i++) {
    arr[i] = sineWaveAt(i, tone) * volume;
  }
  console.log(arr);
  return arr;
}

// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillator node
var oscillator = audioCtx.createOscillator();

function MakeNoise() {
  oscillator.type = 'square';
  oscillator.frequency.value = 440; // value in hertz
  oscillator.connect(audioCtx.destination);
  oscillator.start();
}

function StopNoise() {
  oscillator.stop();
}

var mySound = null;
var carrier;

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function preload() {
  soundFormats('mp3', 'ogg', 'wav');
  mySound = loadSound('audio/hey-google.wav');
}

function setup() {
  mySound.setVolume(10);

  var peaks = mySound.getPeaks();
  var max = -10;
  peaks.forEach(function(p) {
    if (p > max) {
      max = p;
    }
  });

  var m = max;
  console.log("m = " + m);
  var depth = 1.0;
  var sampleRate = mySound.sampleRate();
  console.log("sample rate = " + sampleRate);
  console.log("duration = " + mySound.duration());
  console.log(mySound);
  var duration = mySound.duration();
  var channels = mySound.channels();

  var carrierFreq = khz2hz(22);
  carrier = new p5.Oscillator();
  carrier.setType('sine');
  carrier.freq(carrierFreq);
  // depth = peak value of m(t)/carrier.amp
  carrier.amp(m/depth);
  //carrier.start();
  //carrier.amp(mySound);
  console.log(carrier);

  // Fill the buffer with white noise;
  // just random values between -1.0 and 1.0
  var sampleFreq = sampleRate / carrierFreq;
  var buffer = mySound.buffer;
  console.log(buffer);
  console.log(channels);
  for (var channel = 0; channel < channels; channel++) {
    // This gives us the actual array that contains the data
    var nowBuffering = buffer.getChannelData(channel);
    console.log(nowBuffering);
    console.log(nowBuffering.length);
    for (var i = 0; i < nowBuffering.length; i++) {
      //nowBuffering[i] = depth * (1 + (m * nowBuffering[i])) * Math.sin(i / (sampleFreq / (Math.PI*2)));
      nowBuffering[i] = depth * (1 + (nowBuffering[i])) * Math.cos((i/sampleRate) * carrierFreq * Math.PI * 2 );
    }
    console.log(10/sampleRate);
  }

  saveSound(mySound, 'audio/high_freq.wav'); // save file
  mySound.play();
}

function playSoundP5() {
  mySound.play();
}

$(document).ready(function() {
  $("#play").click(function() {
    console.log("clicked play!");
    playSoundP5();
    return false;
  });

  $("#stop_sound").click(function() {
    carrier.stop();
  });
});