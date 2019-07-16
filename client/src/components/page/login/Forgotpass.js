import React, { PropTypes } from "react";
import axios from "axios";
import { withContext } from "../../../context/WithContext";
import config from "../../../modules/config";

class Forgotpass extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      email: "",
      showError: false,
      messageFromServer: ""
    };
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  sendEmail = e => {
    console.log("submitted");
    e.preventDefault();
    if (this.state.email === "") {
      this.setState({
        showError: false,
        messageFromServer: ""
      });
      console.log("empty");
    } else {
      // create a string for an HTTP body message
      const email = encodeURIComponent(this.state.email);
      const body = {
        email
      };
      let UnAthorizedHeader = config.UnAthorizedHeader();

      axios
        .post("/auth/forgot", body, UnAthorizedHeader)
        .then(response => {
          console.log(response.data);
          if (response.data === "email not in db") {
            this.setState({
              showError: true,
              messageFromServer: ""
            });
          } else {
            this.setState({
              showError: false,
              messageFromServer: response.data
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  render() {
    const { email, messageFromServer, showNullError, showError } = this.state;
    return (
      <div className="stand container mx-auto text-center border mx-auto shadow-sm p-3 mb-5 bg-white rounded">
        <h2 className="mb-4">Please Enter Your Email Address.</h2>
        <form
          className="form-signin mx-auto d-felx w-50"
          onSubmit={this.sendEmail}
        >
          <input
            type="text"
            id="email"
            className="form-control mb-2 mx-auto"
            label="email"
            value={email}
            onChange={this.handleChange("email")}
            placeholder="Email Address"
            required=""
          />
          <button
            type="submit"
            className="btn btn-lg btn-dark btn-block mx-auto"
          >
            Send a reset link
          </button>
        </form>
        {showNullError && (
          <div>
            <p>The email address cannot be null.</p>
          </div>
        )}
        {showError && (
          <div>
            <p>
              that email addrees isnt recognised. Please try again or regioster
              for a new account.
            </p>
          </div>
        )}
        {messageFromServer === "recovery email sent" && (
          <div>
            <h5 className="mt-4 text-info">
              Password Reset email Successfully sent!
            </h5>
          </div>
        )}
      </div>
    );
  }
}
export default Forgotpass;
