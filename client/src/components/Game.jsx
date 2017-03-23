import React from 'react';
import WaitingRoom from './WaitingRoom.jsx';
import PlayingGame from './PlayingGame.jsx';
import $ from 'jquery';
import io from 'socket.io-client';
const socket = io();
const context = this;

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      game: null,
      username: null
    };

    this.getGameData = this.getGameData.bind(this);
    this.getUsername = this.getUsername.bind(this);
    this.handleResponse = this.handleResponse.bind(this);

    socket.on('start game', (gameObj) => {
      context.setState({game: gameObj});
    })
  }

  componentDidMount() {
    this.getGameData(this.props.params.gamename);
    this.getUsername();
  }

  socketHandlers() {
    //TODO: check best practice for socket events
    // on 'start game', set game state to be data (game instance obj)

    // emit 'submit response', send response and gamename and username as data to that socket room

    // on 'start judging', set game state to new game instance obj data

    // emit 'judge selection', send username of winner, gamename

    // on 'winner chosen', update game state with new game instance obj

    // emit 'ready to move on', send username and gamename

    // on 'start next round', update game state with new game instance obj

    // on 'game over', update game state w/ new game instance obj
  }

  getGameData(gameName) {
    // use gameName to retrieve gameInstance obj of that game
    $.ajax({
      url: 'http://localhost:3000/game',
      method: 'GET',
      headers: {'content-type': 'application/json'},
      data: {name: gameName},
      success: (data) => {
        this.setState({game: data[0]})
      },
      error: (err) => {
          console.log('error getting games: ', err);
      }
    });
  }

  getUsername() {
    $.ajax({
      url: 'http://localhost:3000/username',
      method: 'GET',
      headers: {'content-type': 'application/json'},
      success: (username) => {
        this.setState({username: username}, function() {
          socket.emit('join game', {gameName: this.props.params.gamename, username: this.state.username});
        });
      },
      error: (err) => {
        console.log('error getting username', err);
      }
    });
  }

  handleResponse(response) {
    socket.emit('submit response', {gameName: this.props.params.gamename, username: this.state.username, response: response});
  }

  render() {
    return (
      <div id="game">
        <h4>Game!</h4>
        {this.props.params.gamename}
        {this.state.game && this.state.game.gameStage === 'waiting' && <WaitingRoom numPlayers={this.state.game.players.length} players={this.state.game.players}/>}
        {this.state.game && this.state.user && this.state.game.gameStage === 'playing' && <PlayingGame game={this.state.game} user={this.state.user} handleResponse={this.handleResponse}/>}
      </div>
    )
  }
}

export default Game;