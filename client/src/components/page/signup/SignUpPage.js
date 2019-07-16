import React from "react";
import SignUpForm from "./SignUpForm";
import config from "../../../modules/config";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
class SignUpPage extends React.Component {
  state = {
    errors: {},
    user: {
      email: "",
      name: "",
      password: ""
    }
  };

  processForm = event => {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const name = encodeURIComponent(this.state.user.name);
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);

    const body = {
      name,
      email,
      password
    };

    let UnAthorizedHeader = config.UnAthorizedHeader();

    axios
      .post("/auth/signup", body, UnAthorizedHeader)
      .then(response => {
        this.setState({
          errors: {}
        });
        localStorage.setItem("successMessage", response.data.message);
        return this.props.history.push("/login");
      })
      .catch(error => {
        console.log(error.response);
        let { errors } = error.response.data;
        this.setState({
          errors
        });
      });
  };

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser = event => {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    console.log("userrrrrrr");
    console.log(user);
    this.setState(
      {
        user
      },
      () => {
        console.log("userrrrrrr");
        console.log(this.state.user);
      }
    );
  };

  /**
   * Render the component.
   */
  render() {
    return (
      <div className=" stand border mx-auto shadow-sm p-3 mb-5 bg-white rounded">
        <SignUpForm
          onSubmit={this.processForm}
          onChange={this.changeUser}
          errors={this.state.errors}
          user={this.state.user}
        />
        <div className="text-center pb-3">
          <Link
            to={{
              pathname: "/login"
            }}
          >
            Already have an account?
          </Link>
        </div>
      </div>
    );
  }
}
export default SignUpPage;
