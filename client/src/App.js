import React, { Component } from "react";
import SignUpPage from "./components/page/signup/SignUpPage";
import LoginPage from "./components/page/login/LoginPage";
import Forgotpass from "./components/page/login/Forgotpass";
import Resetpass from "./components/page/login/Resetpass";
import HomePage from "./components/page/HomePage";
import LogOut from "./components/child/LogOut";
import AccountPage from "./components/page/account/AccountPage";
import Provider from "./context/Provider";
import "./App.css";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import Auth from "./modules/Auth";
import "./App.css";
import NavBar from "./components/child/NavBar";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Auth.isUserAuthenticated() ? (
        <Component {...props} {...rest} />
      ) : (
        <React.Fragment>
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        </React.Fragment>
      )
    }
  />
);

const LoggedOutRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Auth.isUserAuthenticated() ? (
        <Redirect
          to={{
            pathname: "/",
            state: { from: props.location }
          }}
        />
      ) : (
        <Component {...props} {...rest} />
      )
    }
  />
);
const GlobalRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => <Component {...props} {...rest} />} />
);

class App extends Component {
  componentDidMount() {}
  render() {
    return (
      <Provider>
        <Router>
          <div>
            <NavBar />
            <PrivateRoute exact path="/" component={HomePage} />
            <PrivateRoute path="/account" component={AccountPage} />
            <LoggedOutRoute path="/signup" component={SignUpPage} />
            <LoggedOutRoute path="/login" component={LoginPage} />
            <LoggedOutRoute path="/forgotpass" component={Forgotpass} />
            <LoggedOutRoute path="/reset" component={Resetpass} />
            <PrivateRoute path="/logout" component={LogOut} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
