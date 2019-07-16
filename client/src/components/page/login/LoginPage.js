import React, { PropTypes } from "react";
import Auth from "../../../modules/Auth";
import LoginForm from "./LoginForm";
import config from "../../../modules/config";
import axios from "axios";
import { withContext } from "../../../context/WithContext";
import Forgotpass from "./Forgotpass";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import "../../../App.css";

class LoginPage extends React.Component {
  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    const storedMessage = localStorage.getItem("successMessage");
    let successMessage = "";

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem("successMessage");
    }

    // set the initial component state
    this.state = {
      errors: {},
      successMessage,
      user: {
        email: "",
        password: ""
      }
    };
  }

  renderRedirect = () => {
    this.props.history.push("/signup");
  };

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm = event => {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const body = {
      email,
      password
    };
    let UnAthorizedHeader = config.UnAthorizedHeader();
    // let formData = Object.assign({}, body, UnAthorizedHeader);

    axios
      .post("/auth/login", body, UnAthorizedHeader)
      .then(response => {
        console.log("trigggereed");
        this.setState({
          errors: {}
        });
        Auth.authenticateUser(response.data.token);
        this.props.Context.setUser();
        return this.props.history.push("/");
      })
      .catch(error => {
        console.log(error.response);
        let { errors, message } = error.response.data;
        const errorLogs = errors ? errors : { message };
        errorLogs.summary = message;

        this.setState({
          errors: errorLogs
        });
      });
  };

  changeUser = event => {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  };
  forgotPass = () => {
    return <Forgotpass />;
  };

  /**
   * Render the component.
   */
  render() {
    return (
      <div className=" stand border mx-auto shadow-sm p-3 mb-5 bg-white rounded">
        <LoginForm
          onSubmit={this.processForm}
          onChange={this.changeUser}
          errors={this.state.errors}
          successMessage={this.state.successMessage}
          user={this.state.user}
          renderRedirect={this.renderRedirect}
        />

        <div className="text-center mt-2">
          <Link
            to={{
              pathname: "/forgotpass"
            }}
            onClick={this.forgotPass}
          >
            Forgot Your Password?
          </Link>
        </div>
      </div>
    );
  }
}

export default withContext(LoginPage);
