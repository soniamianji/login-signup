import React from "react";
import config from "../../../modules/config";
import axios from "axios";

class DeleteAccount extends React.Component {
  constructor(props) {
    super(props);
  }
  onSubmitHandler = e => {
    e.preventDefault();

    const AuthorizationHeader = config.AuthorizationHeader();
    axios.delete("/api/deleteuser", AuthorizationHeader).then(response => {
      this.props.history.push("/logout");
    });
  };
  render() {
    return (
      <div className=" d-flex justify-content-end ">
        <form className="w-50">
          <button
            type="submit"
            className="btn btn-dark w-100 mt-2"
            onClick={e => {
              if (
                window.confirm("Are you sure you wish to delete this Account?")
              )
                this.onSubmitHandler(e);
            }}
          >
            Delete the account
          </button>
        </form>
      </div>
    );
  }
}

export default DeleteAccount;
