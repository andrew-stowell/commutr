import React, { Component } from 'react';
import firebase, { auth, provider } from '../resources/firebase.js';
import Swiper from 'react-id-swiper';

const params = {
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  }
};

class Login extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      email: null,
      password: null,
      signInError: null,
      signUpError: null,
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
      
      this.setState({
        signUpError: errorMessage,
      })
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

      this.setState({
        signInError: errorMessage,
      })
    });
  }

  handleError (code, message) {

  }

  render() {
    return (
        <div className='wrapper'>
        {this.state.user ?
          <div className='logoutForm'>
            <div>Email: {this.state.user.email}</div>
            <button onClick={this.logout}>Logout</button>
          </div>
        :
          <div className="signInUpForm">
            <Swiper>
              <form onSubmit={this.signInTraditional}>
                <h2>Sign In</h2>
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" required onChange={this.handleChange} />
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" required onChange={this.handleChange} />
                {this.state.signInError &&
                  <div className='error'>{this.state.signInError}</div>
                }
                <button type="submit">sign in</button>
              </form>

              <form onSubmit={this.createAccount}>
                <h2>Create Account</h2>
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" required onChange={this.handleChange} />
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" required onChange={this.handleChange} />
                {this.state.signUpError &&
                  <div className='error'>{this.state.signUpError}</div>
                }
                <button type="submit">sign up</button>
              </form>
            </Swiper>
            <p>Need an account? Swipe left!</p>
          </div>
        }
        </div>
    );
  }
}

export default Login;