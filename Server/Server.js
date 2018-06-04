var express = require('express');
var app = express();
let bodyParser = require("body-parser");
let sar = require('./App.js');

let sendAndRecieve = sar.getSendAndRecieve();

app.get('/', function(req, res){
  res.send('Hello World')
});


app.use('/game', bodyParser.urlencoded({extended: true}));
app.use('/game', bodyParser.json());

app.post('/game', (req, res) => {
  console.log(req.body)
  sendAndRecieve(req.body.sentence, (res) => {console.log("coucou")});
  res.send(req.body)
})

app.listen(8080, function(){
  console.log('listening on port 8080');
})
