import React, { Component } from 'react';
import '../App.css';
import firebase, { auth, provider } from '../resources/firebase.js';
import Swiper from 'react-id-swiper';

const dateFormat = require('dateformat');
const today = new Date();

const params = {
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  }
};

class TrackTime extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      loggedData: null,
      leaveHome: null,
      arriveWork: null,
      leaveWork: null,
      arriveHome: null,
    }
    this.trackTime = this.trackTime.bind(this);
  }

  // keeps the local store in sync with the firebase db
  watchData() {
    const itemsRef = firebase.database().ref('items/' + this.state.user.uid);

    itemsRef.on('value', (snap) => {
      const latestData = snap.val();
      if (latestData !== null && typeof latestData[dateFormat(today, 'yyyymmdd')] !== 'undefined') {
        Object.keys(latestData[dateFormat(today, 'yyyymmdd')]).map(key => {
          this.setState({
            [key]: latestData[dateFormat(today, 'yyyymmdd')][key]
          });
        });
      }
    });
  }

  trackTime(e) {
    const now = new Date();
    const timepoint = e.target.dataset.name;

    // set up our dynamic data object
    let data = {
      [timepoint]: dateFormat(now, 'isoTime'),
    }

    const itemsRef = firebase.database().ref('items/' + this.state.user.uid + '/' + dateFormat(today, 'yyyymmdd'));

    itemsRef.update(data);
  }

  componentDidMount() {
    this.authListener = auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
        // console.log(user);
        this.watchData();
      } else {
        // send user to login page if not logged in
        this.props.history.push("/login");
      }
    });
  }

  //remove 
  componentWillUnmount () {
    this.authListener && this.authListener()
  }

  render() {
    return (
      <div className="track-time">
        {this.state.user ?
          <div className="track-time--inner">
            <div className="date">
              {dateFormat(today, 'm/d/yy')}
            </div>
            <Swiper {...params}>
              <div className="form-section form-section--morning">
                {this.state.leaveHome ? 
                  <div className="logged">Logged! - {this.state.leaveHome}</div>
                :
                  <button onClick={this.trackTime} data-name="leaveHome" type="button">Leave Home</button>
                }

                {this.state.arriveWork ? 
                  <div className="logged">Logged! - {this.state.arriveWork}</div>
                :
                  <button onClick={this.trackTime} data-name="arriveWork" type="button">Arrive At Work</button>
                }
              </div>
              <div className="form-section form-section--evening">
                {this.state.leaveWork ? 
                  <div className="logged">Logged! - {this.state.leaveWork}</div>
                :
                  <button onClick={this.trackTime} data-name="leaveWork" type="button">Leave Work</button>
                }

                {this.state.arriveHome ? 
                  <div className="logged">Logged! - {this.state.arriveHome}</div>
                :
                  <button onClick={this.trackTime} data-name="arriveHome" type="button">Arrive Home</button>
                }
              </div>
            </Swiper>
          </div>
          :
          <div>Validating login</div>
        }
      </div>
    );
  }
}

export default TrackTime;