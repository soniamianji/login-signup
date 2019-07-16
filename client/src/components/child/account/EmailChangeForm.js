import React from "react";
import config from "../../../modules/config";
import axios from "axios";

class EmailChangeForm extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    errors: "",
    user: {},
    password: "",
    emailAddress: "",
    emailFormHidden: false
  };

  onChangeEmailHandler = e => {
    if (e.target.name === "email") {
      this.setState({
        emailAddress: e.target.value
      });
    } else {
      this.setState({
        password: e.target.value
      });
    }
  };
  onClickEmailHandler = () => {
    const AuthorizationHeader = config.AuthorizationHeader();
    const body = {
      email: this.state.emailAddress,
      password: this.state.password
    };
    axios
      .put("/api/editemail", body, AuthorizationHeader)
      .then(response => {
        const { user } = response.data;
        this.setState({ user, emailFormHidden: !this.state.emailFormHidden });
        this.props.emailInputTrigger(
          this.state.emailFormHidden,
          this.state.user
        );
      })
      .catch(err => {
        if (err) {
          console.log(err.response.data);
          let { errors } = err.response.data;
          if (errors !== "") {
            this.setState({ errors });
          }
        }
      });
  };

  render() {
    const user = this.props.user;
    const err = this.state.errors;
    return (
      <React.Fragment>
        <div className="d-flex mx-auto mt-2">
          <input
            type="text"
            name="email"
            onChange={this.onChangeEmailHandler}
            className="form-control w-25 mr-1"
            placeholder={user.email}
          />
          <input
            type="password"
            name="password"
            onChange={this.onChangeEmailHandler}
            className="form-control w-25 mr-2"
            placeholder="password"
          />
          <button
            type="submit"
            onClick={this.onClickEmailHandler}
            className="btn btn-dark w-50"
          >
            Update email
          </button>
        </div>
        {err && (
          <small className="d-flex justify-content-center w-75 text-danger">
            {this.state.errors}
          </small>
        )}
      </React.Fragment>
    );
  }
}

export default EmailChangeForm;
