import React, { PropTypes } from "react";
import axios from "axios";
import { withContext } from "../../../context/WithContext";
import config from "../../../modules/config";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";

export default class ResetPass extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      userToken: "",
      updated: false,
      isLoading: true,
      error: false
    };
  }

  async componentDidMount() {
    const str = this.props.location.pathname.toString();
    const newPath = str.split("/").pop();
    console.log(newPath);

    await axios
      .get("/auth/reset", {
        params: {
          resetPasswordToken: newPath
        }
      })
      .then(response => {
        console.log(response);
        if (response.data.message === "password reset link a-ok") {
          console.log(response.data.email);
          this.setState({
            email: response.data.email,
            userToken: newPath,
            updated: false,
            isLoading: false,
            error: false
          });
        } else {
          this.setState({
            updated: false,
            isLoading: false,
            error: true
          });
        }
      })
      .catch(error => {
        console.log(error.data);
      });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  updatePassword = e => {
    e.preventDefault();
    const unAuthorizedHeader = config.UnAthorizedHeader();
    const body = {
      email: this.state.email,
      password: this.state.password,
      resetPasswordToken: this.state.userToken
    };
    axios
      .put("/auth/updatePassViaMail", body, unAuthorizedHeader)
      .then(response => {
        console.log(response.data);
        console.log(response.message);
        console.log(response.data.message);
        if (response.data.message === "password successfully updated") {
          console.log("yay");
          this.setState({
            updated: true,
            error: false
          });
        } else {
          this.setState({
            updated: false,
            error: true
          });
        }
      })
      .catch(err => {
        console.log(err.data);
      });
  };
  render() {
    const { password, error, isLoading, updated } = this.state;
    if (error) {
      return (
        <div className="stand container mx-auto text-center border mx-auto shadow-sm p-3 mb-5 bg-white rounded">
          <h4> Problem resetting password. Please send another link.</h4>
          <Link
            to={{
              pathname: "/forgotpass"
            }}
            onClick={this.forgotPass}
          >
            Forgot your password?
          </Link>
        </div>
      );
    } else {
      return (
        <div className="stand container mx-auto text-center border mx-auto shadow-sm p-3 mb-5 bg-white rounded">
          <h2 className="mb-4">Please Enter Your New Password</h2>
          <form
            className="form-signin mx-auto d-felx w-50"
            onSubmit={this.updatePassword}
          >
            <input
              type="password"
              onChange={this.handleChange("password")}
              value={password}
              placeholder="Password"
              className="form-control mb-2 mx-auto"
            />
            <button
              type="submit"
              className="btn btn-lg btn-dark btn-block mx-auto"
            >
              Update Password
            </button>
            {updated && (
              <div>
                <p className="text-info mt-4">
                  Your password has been successfully reset, please try logging
                  in again.
                </p>
              </div>
            )}
          </form>
        </div>
      );
    }
  }
}
