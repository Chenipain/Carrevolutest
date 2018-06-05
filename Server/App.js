var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');

const voices = ["fr-FR_ReneeVoice", "de-DE_BirgitVoice", "en-GB_KateVoice", 'en-US_AllisonVoice']

let voicePicker = () => {
  return (voices[Math.floor(Math.random() * Math.floor(voices.length))]);
}

let textToSpeech = new TextToSpeechV1({
  "url": "https://stream.watsonplatform.net/text-to-speech/api",
  "username": "d7132de3-f80a-4553-b8c2-5024ca75657d",
  "password": "MwAw4BbOznzF"
})

let speechToText = new SpeechToTextV1({"url": "https://stream.watsonplatform.net/speech-to-text/api",
  "username": "cb52c9d6-7a65-4a28-8302-c0fa652cc739",
  "password": "zM7z7tkneYfa"

})

let recieve = (callback) => {
  var speechToTextParams = {
    audio :fs.createReadStream('./audio.wav'),
    content_type: 'audio/wav'
  }

  speechToText.recognize(speechToTextParams, function(err, res) {
    if (err)
      console.log(err);
    else
    {
      callback(res);
    }
  });
}

let sendAndRecieve = (sentence, callback) => {

var textToSpeechParams = {
  text: sentence,
  voice: voicePicker(),
  accept: 'audio/wav'
};

textToSpeech.synthesize(textToSpeechParams, function(err, audio){
  if (err) {
    console.log(err);
    return;
  }
  textToSpeech.repairWavHeader(audio);
  fs.writeFile('audio.wav', audio, (err) => {
    if (err) throw err;
    recieve(callback);
    });
})
};

module.exports.getSendAndRecieve = () => {return sendAndRecieve}
module.exports.getRecieve = () => {return recieve}
