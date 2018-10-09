import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';
var _ = require('lodash');

const socket = io('http://localhost:9000');

let result = [];
let socketID = '';
const isPrime = num => {
  for(let i = 2, s = Math.sqrt(num); i <= s; i++)
      if(num % i === 0) return false; 
  return num !== 1;
}
class App extends Component {
  constructor() {
    super();
    this.state = {
      result: [],
      start: 0,
      end: 0,
    };
    this.computePrime = this.computePrime.bind(this);
  }
  componentDidMount() {
    socket.on('connect', () => {
      socketID = socket.id;
      console.log(socketID);
    });
    socket.on('findPrime', ((data) => {
      const range = data.table[socketID];
      const result = [];
      console.log('Requested', data);
      for(let i = range.range.start; i <= range.range.end ; i++){
        if (isPrime(i)) {
          result.push(i);
        }
      }
      socket.emit('computedResult', {
        requester: data.requester,
        id: socketID,
        result
      });
    }));
    socket.on('result', ((data) => {
      data.map((v) => {
        result.push(v);
      });
      result = result.sort((a, b) =>   {
        return a - b;
      });
      this.setState({
        result: _.sortedUniq(result),
      });
    }));
  }
  computePrime() {
    const data = {
      id: socketID,
      data: {
        start: this.state.start,
        end: this.state.end,
      }
    }
    result = [];
    socket.emit('computePrime', data);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Find Prime Numbers !</h1>
        </header>
        <div className={'formInput'}>
          <label forhtml="startPrime">Start number</label>
          <input
            type="number"
            name="startPrime"
            value={this.state.start}
            onChange={(e) => {
              const start = e.target.value;
              this.setState({
                start,
              });
            }}
          />
        </div>
        <div className={'formInput'}>
          <label forhtml="endPrime">End number</label>
          <input
            type="number"
            name="endPrime"
            value={this.state.end}
            onChange={(e) => {
              const end = e.target.value;
              this.setState({
                end,
              });
            }}
          />
        </div>
        <div className="body">
          <button onClick={this.computePrime}>
            Compute Prime
          </button>
          <div className="result">
            <p>
              {this.state.result.join(', ')}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
