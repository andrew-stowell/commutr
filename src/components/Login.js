import React, { Component } from 'react';
import firebase, { auth, provider } from '../resources/firebase.js';

// const dateFormat = require('dateformat');
// const today = new Date();

class Login extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      email: null,
      password: null,
    }
    this.createAccount = this.createAccount.bind(this);
    this.signInTraditional = this.signInTraditional.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.logout = this.logout.bind(this);
  }

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });  
  }

  componentDidMount() {
    this.authListener = auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } 
    });
  }

  componentWillUnmount () {
    this.authListener && this.authListener()
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  createAccount(e) {
    e.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then((authData) => {
        this.props.history.push("/track");
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  signInTraditional(e) {
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then((authData) => {
        this.props.history.push("/track");
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      // ...
    });
  }

  handleError (code, message) {

  }

  render() {
    return (
        <div className='wrapper'>
        {this.state.user ?
          <div>
            <div>{this.state.user.email}</div>
            <div>{this.state.user.uid}</div>
            <button onClick={this.logout}>Logout</button>
          </div>
        :
          <div className="signInUpForm">
            <p>You must be logged before tracking your commute.</p>
            <form onSubmit={this.createAccount}>
              <div>Sign Up!</div>
              <input type="email" name="email" onChange={this.handleChange} />
              <input type="password" name="password" onChange={this.handleChange} />
              <button type="submit">sign up</button>
            </form>

            <form onSubmit={this.signInTraditional}>
              <div>Sign In!</div>
              <input type="email" name="email" onChange={this.handleChange} />
              <input type="password" name="password" onChange={this.handleChange} />
              <button type="submit">sign in</button>
            </form>
          </div>
        }
        </div>
    );
  }
}

export default Login;