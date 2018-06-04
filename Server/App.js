var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');

let textToSpeech = new TextToSpeechV1({username : "75ecc4dc-8636-4cf3-8482-f590385fbfd8",
                                        password : "TCpibjUulWiN",
                                      url: "https://stream.watsonplatform.net/text-to-speech/api"})

let speechToText = new SpeechToTextV1({
  url: "https://stream.watsonplatform.net/speech-to-text/api",
  username: "9ca30f37-beb6-4e32-8362-125de844102a",
  password: "AyPKL5lVSZPv"
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
      console.log(JSON.stringify(res, null, 2));
      callback(res);
    }
  });
}

let sendAndRecieve = (sentence, callback) => {

var textToSpeechParams = {
  text: sentence,
  voice: 'en-US_AllisonVoice',
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
