import React from "react";
import config from "../../../modules/config";
import axios from "axios";

class UserName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: "",
      user: {},
      userName: "",
      formHidden: false
    };
  }
  onClickHandler = () => {
    const AuthorizationHeader = config.AuthorizationHeader();
    const body = {
      userName: this.state.userName
    };
    console.log(body);
    axios
      .put("/api/editusername", body, AuthorizationHeader)
      .then(response => {
        const { user } = response.data;
        this.setState({ user, formHidden: !this.state.formHidden });
        this.props.userNameHandleTrigger(
          this.state.formHidden,
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
  onChangeHandler = e => {
    this.setState({
      userName: e.target.value
    });
  };

  render() {
    const user = this.props.user;
    const err = this.state.errors;
    return (
      <React.Fragment>
        <div className="d-flex  mx-auto mt-2">
          <input
            type="text"
            onChange={this.onChangeHandler}
            className="form-control w-50 mr-2"
            placeholder={user.name}
          />

          <button
            type="submit"
            onClick={this.onClickHandler}
            className="btn btn-dark w-50 "
          >
            Update User Name
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

export default UserName;
