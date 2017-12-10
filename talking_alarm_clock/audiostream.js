/**
 * Created by erin on 12/10/17.
 */
var audioStream = null;
var audioRecorder = null;
var mediaChunks = [];

// Put variables in global scope to make them available to the browser console.
var mediaConstraints = window.constraints = {
  audio: true,
  video: false
};

function mediaSuccessHandler(stream) {
  console.log('Got stream with constraints: ', stream);
  var options = {
    audioBitsPerSecond : 128000, // this is the highest allowed
    videoBitsPerSecond : 0,
    mimeType : 'audio/webm'
  }

  audioStream = stream;
  audioRecorder = new MediaRecorder(stream, options);

  audioRecorder.onstop = stopAudioRecorder;
  audioRecorder.ondataavailable = onAudioRecorderDataAvailable;
}

function stopAudioRecorder(e) {
  console.log("data available after MediaRecorder.stop() called.");

  var audio = document.createElement('audio');
  audio.setAttribute('controls', '');
  audio.setAttribute('id', 'temporary-audio-id');
  audio.setAttribute('type', 'audio/webm');
  audio.setAttribute('volume', '1'); // highest volume; might want to reduce
  document.body.appendChild(audio);

  audio.controls = true;
  var blob = new Blob(mediaChunks, { 'type' : 'audio/webm; codecs=opus' });
  mediaChunks = [];
  var audioURL = URL.createObjectURL(blob);
  audio.src = audioURL;
  console.log(audioURL);
  console.log("recorder stopped");
}

function onAudioRecorderDataAvailable(e) {
  mediaChunks.push(e.data);
  //console.log("got media data");
}

function mediaErrorHandler(error) {
  console.log('Got getUserMedia error: ' + error)
}