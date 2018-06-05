var express = require('express');
var app = express();
let bodyParser = require("body-parser");
let sar = require('./App.js');
let mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI, (err) => {if (err) console.error(err); else console.log("Connection to mongo OK")})
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
    return;
  }
  sendAndRecieve(req.body.sentence, (res) => {
    var newTurn = new Turn({sentence: res.results[0].alternatives[0].transcript, name: req.body.name, turn: i + 1, comparison:0 });
    newTurn.save((err, newTurn) => {if (err) console.error(err); else {console.log("ok")}})
  })
  playGame(req, i + 1, end);
}


app.get('/', function(req, res){
  Turn.find({turn: 0}, (err, result) => {if (err) console.error(err); else {console.log(result);res.send(result);}});
});

app.use('/game', bodyParser.urlencoded({extended: true}));
app.use('/game', bodyParser.json());
app.use('/game', (req, res, next) => {
  if (req.method == "POST")
  {
  var newTurn = new Turn({sentence: req.body.sentence, name: req.body.name, turn:0, comparison:0 });
  newTurn.save((err, newTurn) => {if (err) console.error(err);});
  playGame(req, 0, req.body.turn);
  }
  next();
})


app.post('/game', (req, res) => {
  console.log(req.body)
  res.send("OK")
})

app.get('/game', (req, res) => {
  Turn.find({name: req.query.name}, (err, result) => {if (err) console.error(err); else {console.log(result);res.send(result);}});
})


app.listen(process.env.PORT, function(){
  console.log('listening on port ' + process.env.PORT);
})
