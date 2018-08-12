import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:9000');

const isPrime = num => {
  for(let i = 2, s = Math.sqrt(num); i <= s; i++)
      if(num % i === 0) return false; 
  return num !== 1;
}
class App extends Component {
  componentDidMount() {
    socket.on('getPrime', ((data) => {
      console.log(data);
      for(let i = data.start; i <= data.end ; i++){
        if (isPrime(i)) {
          console.log(i);
        }
      }
    }));
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
