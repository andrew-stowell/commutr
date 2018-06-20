import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './resources/firebase.js';
import merge from 'deepmerge'
const dateFormat = require('dateformat');
const today = new Date();

class App extends Component {
  constructor() {
    super();
    this.state = {
      leaveHomeTime: '',
      arriveWorkTime: ''
    }
    this.trackTime = this.trackTime.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this); // <-- add this line
  }

  trackTime(e) {
    const now = new Date();
    const timepoint = e.target.dataset.name;
    const direction = e.target.dataset.direction;
    
    // set up our dynamic data object
    let data = {
      [direction]: {
        [timepoint]: dateFormat(now, 'isoTime'),
      }
    }

    const currData = localStorage.getItem(dateFormat(today, 'yyyymmdd'));

    if (currData === null) {
      localStorage.setItem(dateFormat(today, 'yyyymmdd'), JSON.stringify(data));
    } else {
      const mergedData = merge(JSON.parse(currData), data);
      localStorage.setItem(dateFormat(today, 'yyyymmdd'), JSON.stringify(mergedData));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const currData = JSON.parse(localStorage.getItem(dateFormat(today, 'yyyymmdd')));
    const itemsRef = firebase.database().ref('items');

    const item = {
      [dateFormat(today, 'yyyymmdd')]: currData,
    }
    itemsRef.push(item);

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Commutr</h1>
        </header>
        <div className="date">
          {dateFormat(today, 'm/d/yy')}
        </div>
        
        <form onSubmit={this.handleSubmit}>
          <div className="form-section form-section--morning">
          <button onClick={this.trackTime} data-direction="to" data-name="leaveHome" type="button">Leave Home</button>
          <button onClick={this.trackTime} data-direction="to" data-name="arriveWork" type="button">Arrive At Work</button>
          </div>
          <div className="form-section form-section--evening">
          <button onClick={this.trackTime} data-direction="from" data-name="leaveWork" type="button">Leave Work</button>
          <button onClick={this.trackTime} data-direction="from" data-name="arriveHome" type="button">Arrive Home</button>
          </div>
          <div className="submit-button">
            <button type="submit">Submit Day</button>
          </div>
        </form>
        
      </div>
    );
  }
}

export default App;
