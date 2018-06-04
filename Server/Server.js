var express = require('express');
var app = express();
let bodyParser = require("body-parser");
let sar = require('./App.js');
let mongoose = require('mongoose');

mongoose.connect("mongodb://Chenipain:super2018@ds147180.mlab.com:47180/carrevolutest")
let sendAndRecieve = sar.getSendAndRecieve();

let turnSchema = mongoose.Schema({
  sentence: String,
  name: String,
  turn: Number,
  comparison: Number
})

let Turn = mongoose.model('Turn', turnSchema);

function playGame(req, i, end){
  if (i == end)
  {
    Turn.find({name: req.body.name}, (err, result) => {if (err) console.error(err); else console.log(result)});
    return;
  }
  sendAndRecieve(req.body.sentence, (res) => {
    var newTurn = new Turn({sentence: res.results[0].alternatives[0].transcript, name: req.body.name, turn: i + 1, comparison:0 });
    newTurn.save((err, newTurn) => {if (err) console.error(err); else {console.log("ok"); playGame(req, i + 1, end);}})
  })
}


app.get('/', function(req, res){
  res.send('Hello World')
});

app.use('/game', bodyParser.urlencoded({extended: true}));
app.use('/game', bodyParser.json());
app.use('/game', (req, res, next) => {
  if (req.method == "POST")
  {
  var newTurn = new Turn({sentence: req.body.sentence, name: req.body.name, turn:0, comparison:0 });
  newTurn.save((err, newTurn) => {if (err) console.error(err);});
  playGame(req, 0, req.body.turn)
  }
  next();

})


app.post('/game', (req, res) => {

  res.send(req.body)
})

app.get('/game', (req, res) => {
  Turn.find({name: req.body.name}, (err, result) => {if (err) console.error(err); else console.log(result)});
  res.send(req.body);
})


app.listen(8080, function(){
  console.log('listening on port 8080');
})
