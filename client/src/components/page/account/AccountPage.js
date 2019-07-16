import React from "react";
import config from "../../../modules/config";
import axios from "axios";
import Username from "../../child/account/UserName";
import EmailChangeForm from "../../child/account/EmailChangeForm";
import DeleteAccount from "../../child/account/DeleteAccount";
import { withContext } from "../../../context/WithContext";

class AccountPage extends React.Component {
  state = {
    user: {},
    users: [],
    userNameIsHidden: true,
    isHidden: true
  };
  userNameHandleTrigger = (newBool, newName) => {
    this.setState({
      userNameIsHidden: !this.state.userNameIsHidden
    });
    if (newName) {
      this.props.Context.setUser(newName);
    }
  };

  emailInputTrigger = (bool, newEmail) => {
    this.setState({
      isHidden: !this.state.isHidden
    });
    if (newEmail) {
      this.props.Context.setUser(newEmail);
    }
  };

  render() {
    let user = this.props.Context.user;
    const nameIsHidden = this.state.userNameIsHidden;
    const emailIsHidden = this.state.isHidden;
    return (
      <React.Fragment>
        <h3 className="text-center mt-5 mb-3">User Dashboard</h3>
        <div className="stand border mx-auto shadow-sm p-3 mb-5 bg-white rounded">
          {nameIsHidden && (
            <div className="d-flex justify-content-center">
              <h6 className="text-center  pt-3 w-50 ">{user.name}</h6>
              <button
                type="submit"
                onClick={this.userNameHandleTrigger}
                className="btn btn-dark w-50 mt-2"
              >
                Edit username
              </button>
            </div>
          )}
          {!nameIsHidden && (
            <Username
              user={this.props.Context.user}
              userNameHandleTrigger={this.userNameHandleTrigger}
            />
          )}
          {emailIsHidden && (
            <div className=" d-flex justify-content-center ">
              <h6 className="text-center pt-3  w-50 ">{user.email}</h6>
              <button
                type="submit"
                onClick={this.emailInputTrigger}
                className="btn btn-dark w-50 mt-2"
              >
                Edit Email address
              </button>
            </div>
          )}
          {!emailIsHidden && (
            <EmailChangeForm
              user={this.props.Context.user}
              emailInputTrigger={this.emailInputTrigger}
            />
          )}
          <DeleteAccount history={this.props.history} />
        </div>
      </React.Fragment>
    );
  }
}
export default withContext(AccountPage);
