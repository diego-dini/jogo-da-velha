const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();

let games = {

}

class game_session {
  constructor() {
    this.players = []
    this.game = {
      current_turn: 0,
      turn: 1,
      grid: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ended: false
    }
  }
}

// Add headers before the routes are defined
app.use(bodyParser.urlencoded({ extended: false }), bodyParser.json());

// Without middleware

app.get('/', function(req, res) {
  res.sendFile(Get_Path("/menu/index.html"))

});

app.get('/game/:login', function(req, res) {
  let login = JSON.parse(req.params.login)
  if (!games[login.password]) {
    games[login.password] = new game_session
    games[login.password].players.push(login.player_name)
  }
  res.sendFile(Get_Path("/jogo/index.html"))

});
app.get('/get/:path/:file', function(req, res) {
  var path = req.params.path
  let file = req.params.file
  res.sendFile(Get_Path(`/${path}/${file}`))

});


app.get('/r/:login', function(req, res) {
  let login = JSON.parse(req.params.login)
  if (games[login.password]) {
    let temp_game = new game_session
    games[login.password].game = temp_game.game
    games[login.password].players = temp_game.players
    res.send(games[login.password].game)
  }
});

app.get('/t/:login', function(req, res) {
  let login = JSON.parse(req.params.login)
  if (games[login.password]) {
    res.send(games[login.password].game)
  }

});

app.post('/y/:login', function(req, res) {
  let login = JSON.parse(req.params.login)
  if (games[login.password]) {
    console.log(games[login.password])
    if (true) {
      if (req.body.current_turn == games[login.password].game.current_turn) {
        console.log(games[login.password])
        games[login.password].game = req.body
        games[login.password].game.current_turn += 1
      }
    }
  }
});

app.listen(PORT, function(err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});


function Get_Path(fileName) {
  let options = {
    root: path.join(__dirname)
  };
  return options.root + fileName
}