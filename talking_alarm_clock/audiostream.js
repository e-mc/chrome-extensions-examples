/**
 * Created by erin on 12/10/17.
 */
var audioStream = null;
var audioRecorder = null;
var mediaChunks = [];
var recognizer = null;
var existingIds = [];
var saveAudio = false;
var audioElementId = null;

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
  audioRecorder.sampline

  //audioRecorder.onstop = saveAudioRecording;
  audioRecorder.ondataavailable = onAudioRecorderDataAvailable;
}

function playBlobAsSound(blob) {
  var useArrayBuffer = function(err, result) {
    if (err) {
      console.log("got error: " + err);
    }
    
    audioCtx.decodeAudioData(result).then(function (buffer) {
      console.log("decoding audio");
      var source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start(0);
    }).catch(function (e) {
      console.log("Error with decoding audio data " + e);
    });
  };

  var reader = new FileReader();

  function onLoadEnd (event) {
    reader.removeEventListener('loadend', onLoadEnd, false);
    if (event.error) {
      useArrayBuffer(event.error);
    } else {
      useArrayBuffer(null, event.target.result)
    }
  };

  reader.onload = onLoadEnd;
  //reader.addEventListener('loadend', onLoadEnd, false);
  reader.readAsArrayBuffer(blob)
}

function saveAudioRecording(audioId) {
  if (existingIds.indexOf(audioId) > -1) {
    return;
  }
  //existingIds.push(audioId);
  var clone = mediaChunks.slice(0);
  console.log(clone);
  var blob = new Blob(clone, { 'type' : 'audio/webm' });
  playBlobAsSound(blob);

  console.log("created audio object with id " + audioId);
}

function onAudioRecorderDataAvailable(e) {
  mediaChunks.push(e.data);
}

function mediaErrorHandler(error) {
  console.log('Got getUserMedia error: ' + error)
}

function startRecorder() {
  console.log("recorder start");
  audioRecorder.start(500);
}

function stopRecorder() {
  console.log("recorder stop");
  audioRecorder.stop();
}

function addRecognitionHandlers() {
  /**
   * Add new handlers to existing annyang recognizer
   * @type {*}
   */
  recognizer = annyang.getSpeechRecognizer();

  var onaudiostart = recognizer.onaudiostart || function() {};
  recognizer.onaudiostart = function() {
    onaudiostart();
    if (audioRecorder.state === 'inactive') {
      startRecorder();
    }
  }

  var onsoundstart = recognizer.onsoundstart || function() {};
  recognizer.onsoundstart = function() {
    mediaChunks = mediaChunks.slice(Math.max(mediaChunks.length - 4, 0));
    //mediaChunks = [];
    onsoundstart();
    //startRecorder();
  };

  var onspeechend = recognizer.onspeechend || function() {};
  recognizer.onspeechend = function() {
    /*
    onspeechend();
    console.log("speech end");
    //stopRecorder();
    if (saveAudio) {
      saveAudioRecording(audioElementId);
    }
    saveAudio = false;
    mediaChunks = [];
    */
  };
}

