import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:9000');

let socketID = '';

const isPrime = num => {
  for(let i = 2, s = Math.sqrt(num); i <= s; i++)
      if(num % i === 0) return false; 
  return num !== 1;
}
class App extends Component {
  componentDidMount() {
    socket.on('connect', () => {
      socketID = socket.id;
      console.log(socketID);
    });
    socket.on('getPrime', ((data) => {
      console.log(data);
      for(let i = data.start; i <= data.end ; i++){
        if (isPrime(i)) {
          console.log(i);
        }
      }
    }));
  }
  computePrime() {
    const data = {
      id: socketID,
      data: {
        start: 0,
        end: 100,
      }
    }
    socket.emit('computePrime', data);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Find Prime Numbers !</h1>
        </header>
        <div className="body">
          <button onClick={this.computePrime} >
            ComputePrime
          </button>
        </div>
      </div>
    );
  }
}

export default App;
