import React from "react";
import config from "../../modules/config";
import axios from "axios";
import { withContext } from "../../context/WithContext";

class HomePage extends React.Component {
  state = {};
  componentDidMount() {
    this.props.Context.setUsers();
  }
  render() {
    const user = this.props.Context.user;
    const users = this.props.Context.users;
    return (
      <React.Fragment>
        <h1 className="text-center mt-5">Hey {user && user.name}</h1>
        <ul>{users && users.map((item, i) => <li key={i}>{item.name}</li>)}</ul>
      </React.Fragment>
    );
  }
}
export default withContext(HomePage);
