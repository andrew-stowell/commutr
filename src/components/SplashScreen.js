import React, { Component } from 'react';
import firebase, { auth, provider } from '../resources/firebase.js';

class SplashScreen extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
    }
  }
  componentDidMount() {
    this.authListener = auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
        this.props.history.push("/track");
      } else {
        this.props.history.push("/login");
      }
    });
  }

  componentWillUnmount () {
    this.authListener && this.authListener()
  }

  render() {
    return (
        <div className='wrapper'>
          Loading App...
        </div>
    );
  }
}

export default SplashScreen;