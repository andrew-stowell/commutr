import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom";
import TrackTime from './components/TrackTime';
import Login from './components/Login';
import SplashScreen from './components/SplashScreen';
import ReportsScreen from './components/Reports';
import PageNotFound from './components/PageNotFound';


class App extends Component {

  render() {
    return(
      <Router>
        <div className="app">
          <header className="app__header">
            <h1 className="app__title">Commutr</h1>
          </header>
          <Switch>
            <Route exact path="/" component={SplashScreen} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/track" component={TrackTime} />
            <Route exact path="/reports" component={ReportsScreen} />
            <Route component={PageNotFound} />
          </Switch>
          <ul className="nav">
            <li>
              <NavLink activeClassName="active" to="/track">Track</NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/reports">Reports</NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/login">Account</NavLink>
            </li>
          </ul>
        </div>
      </Router>
    );
  }
  
}
export default App;