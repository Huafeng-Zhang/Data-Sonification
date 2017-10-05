const SAMPLE_LIBRARY = {
  'Grand Piano': [
    { note: 'A',  octave: 4, file: 'Samples/Grand Piano/piano-f-a4.wav' },
    { note: 'A',  octave: 5, file: 'Samples/Grand Piano/piano-f-a5.wav' },
    { note: 'A',  octave: 6, file: 'Samples/Grand Piano/piano-f-a6.wav' },
    { note: 'C',  octave: 4, file: 'Samples/Grand Piano/piano-f-c4.wav' },
    { note: 'C',  octave: 5, file: 'Samples/Grand Piano/piano-f-c5.wav' },
    { note: 'C',  octave: 6, file: 'Samples/Grand Piano/piano-f-c6.wav' },
    { note: 'D#',  octave: 4, file: 'Samples/Grand Piano/piano-f-ds4.wav' },
    { note: 'D#',  octave: 5, file: 'Samples/Grand Piano/piano-f-ds5.wav' },
    { note: 'D#',  octave: 6, file: 'Samples/Grand Piano/piano-f-ds6.wav' },
    { note: 'F#',  octave: 4, file: 'Samples/Grand Piano/piano-f-fs4.wav' },
    { note: 'F#',  octave: 5, file: 'Samples/Grand Piano/piano-f-fs5.wav' },
    { note: 'F#',  octave: 6, file: 'Samples/Grand Piano/piano-f-fs6.wav' }
  ],
  'Alto Flute': [
    { note: 'A#',  octave: 4, file: 'Samples/Alto Flute/alto_flute-as3.wav' },
    { note: 'A#',  octave: 5, file: 'Samples/Alto Flute/alto_flute-as4.wav' },
    { note: 'A#',  octave: 6, file: 'Samples/Alto Flute/alto_flute-as5.wav' },
    { note: 'C#',  octave: 4, file: 'Samples/Alto Flute/alto_flute-cs4.wav' },
    { note: 'C#',  octave: 5, file: 'Samples/Alto Flute/alto_flute-cs5.wav' },
    { note: 'C#',  octave: 6, file: 'Samples/Alto Flute/alto_flute-cs6.wav' },
    { note: 'E',  octave: 4, file: 'Samples/Alto Flute/alto_flute-e4.wav' },
    { note: 'E',  octave: 5, file: 'Samples/Alto Flute/alto_flute-e5.wav' },
    { note: 'E',  octave: 6, file: 'Samples/Alto Flute/alto_flute-e6.wav' },
    { note: 'G', octave: 3, file: 'Samples/Alto Flute/alto_flute-g3.wav' },
    { note: 'G', octave: 4, file: 'Samples/Alto Flute/alto_flute-g4.wav' },
    { note: 'G', octave: 5, file: 'Samples/Alto Flute/alto_flute-g5.wav' },
    { note: 'G', octave: 6, file: 'Samples/Alto Flute/alto_flute-g6.wav' }
  ],
  'Harp': [
    { note: 'A',  octave: 2, file: 'Samples/Harp/harp-a2.wav' },
    { note: 'A',  octave: 3, file: 'Samples/Harp/harp-a3.wav' },
    { note: 'A',  octave: 4, file: 'Samples/Harp/harp-a4.wav' },
    { note: 'A',  octave: 5, file: 'Samples/Harp/harp-a5.wav' },
    { note: 'A',  octave: 6, file: 'Samples/Harp/harp-a6.wav' },
    { note: 'C',  octave: 2, file: 'Samples/Harp/harp-c2.wav' },
    { note: 'C',  octave: 3, file: 'Samples/Harp/harp-c3.wav' },
    { note: 'C',  octave: 4, file: 'Samples/Harp/harp-c4.wav' },
    { note: 'C',  octave: 5, file: 'Samples/Harp/harp-c5.wav' },
    { note: 'C',  octave: 6, file: 'Samples/Harp/harp-c6.wav' },
    { note: 'C',  octave: 7, file: 'Samples/Harp/harp-c7.wav' },
    { note: 'D#',  octave: 2, file: 'Samples/Harp/harp-ds2.wav' },
    { note: 'D#',  octave: 3, file: 'Samples/Harp/harp-ds3.wav' },
    { note: 'D#',  octave: 4, file: 'Samples/Harp/harp-ds4.wav' },
    { note: 'D#',  octave: 5, file: 'Samples/Harp/harp-ds5.wav' },
    { note: 'D#',  octave: 6, file: 'Samples/Harp/harp-ds6.wav' },
    { note: 'F#',  octave: 2, file: 'Samples/Harp/harp-fs2.wav' },
    { note: 'F#',  octave: 3, file: 'Samples/Harp/harp-fs3.wav' },
    { note: 'F#',  octave: 4, file: 'Samples/Harp/harp-fs4.wav' },
    { note: 'F#',  octave: 5, file: 'Samples/Harp/harp-fs5.wav' },
    { note: 'F#',  octave: 6, file: 'Samples/Harp/harp-fs6.wav' }
  ]
};

const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

let audioContext = new AudioContext();
let start_time = audioContext.currentTime;
let sampleCache = {};
var noteLength = 100; // in milliseconds
//var sonification_loop_id;
var audio_index = 0;

function setSonificationButtonLabel(label) {
  console.log("Change button label to", label);
  var button = document.getElementById("sonify");
  console.log(button);
  $("#sonify").text(label);
}


function fetchSample(path) {
//console.log("in fetchSample", path);
  sampleCache[path] = sampleCache[path] || fetch(path)
  //sampleCache[path] = sampleCache[path] || fetch(encodeURIComponent(path))
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
  return sampleCache[path];
}

function noteValue(note, octave) {
  return octave * 12 + OCTAVE.indexOf(note);
}

function getNoteDistance(note1, octave1, note2, octave2) {
  return noteValue(note1, octave1) - noteValue(note2, octave2);
}

function getNearestSample(sampleBank, note, octave) {
//console.log(sampleBank, note, octave);
  let sortedBank = sampleBank.slice().sort((sampleA, sampleB) => {
    let distanceToA = Math.abs(getNoteDistance(note, octave, sampleA.note, sampleA.octave));
    let distanceToB = Math.abs(getNoteDistance(note, octave, sampleB.note, sampleB.octave));
    return distanceToA - distanceToB;
  });
  return sortedBank[0];
}

function flatToSharp(note) {
  switch (note) {
    case 'Bb': return 'A#';
    case 'Db': return 'C#';
    case 'Eb': return 'D#';
    case 'Gb': return 'F#';
    case 'Ab': return 'G#';
    default:   return note;
  }
}

function getSample(instrument, noteAndOctave) {
  let [, requestedNote, requestedOctave] = /^(\w[b\#]?)(\d)$/.exec(noteAndOctave);
  requestedOctave = parseInt(requestedOctave, 10);
  requestedNote = flatToSharp(requestedNote);
  let sampleBank = SAMPLE_LIBRARY[instrument];
  let nearestSample = getNearestSample(sampleBank, requestedNote, requestedOctave);
//console.log("in getSample", noteAndOctave, requestedOctave, requestedNote, nearestSample.file);
  return fetchSample(nearestSample.file).then(audioBuffer => ({
    audioBuffer: audioBuffer,
    distance: getNoteDistance(requestedNote, requestedOctave, nearestSample.note, nearestSample.octave)
  }));
}

function playSample(instrument, note, destination, delaySeconds = 0) {
  getSample(instrument, note).then(({audioBuffer, distance}) => {
    let playbackRate = Math.pow(2, distance / 12);
    let bufferSource = audioContext.createBufferSource();

//console.log("playSample", audioBuffer, distance);
    bufferSource.buffer = audioBuffer;
    bufferSource.playbackRate.value = playbackRate;

    bufferSource.connect(destination);
    bufferSource.start(audioContext.currentTime + delaySeconds);
  });
}

function playDataSample(instrument, freq) {
  var note = getNoteFromFreq(freq);
  playSample(instrument, note, audioContext.destination);
}

function getNoteFromFreq(freq) {
  var A4 = 440;
  var C0 = A4 * Math.pow(2, -4.75);
  var noteName = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    
  var h = Math.round(12 * Math.log2(freq/C0));
  var octave = Math.floor(h / 12);
  var n = h % 12;
  //console.log("getNoteFromFreq", freq, noteName[n] + octave.toString());
  if (octave < 1 || octave > 7) {
    debugger;
  }

  return(noteName[n] + octave.toString());
}

function startLoop({instrument, note, duration, delay}, nextNode) {
  playSample(instrument, note, nextNode, delay);
  return setInterval(
    () => playSample(instrument, note, nextNode, delay),
    duration * 1000
  );
}

function data2freq(d) {
  return(10 * d);
}

function Voice(instrument) { 
  this.inst = instrument;
}

function playSound(voice, i) {
  playDataSample(voice.inst, voice.data[[i]]);
}

function sonify(v1=null, v2=null, v3=null, start_index=0) {
  audio_index = start_index;

  var loop_id = setInterval(function() {
    //console.log("index", i, Math.round(audioContext.currentTime - start_time)/10);
    if (v1 != null) {
      playSound(v1, audio_index);
    }
    if (v2 != null) {
      playSound(v2, audio_index);
    }
    if (v3 != null) {
      playSound(v3, audio_index);
    }

    audio_index++;
    if (audio_index >= v1.data.length) {
      audio_index = 0;
      clearInterval(loop_id);
    }
  }, noteLength);

  return(loop_id);
}

function object2array(obj, col="temp") {
  var arr = [];
  for (i = 0; i < obj.length; i++) {
    arr[i] = obj[i][col];
  }

  return arr
}


