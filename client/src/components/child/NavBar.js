import React from "react";
import config from "../../modules/config";
import axios from "axios";
import { withContext } from "../../context/WithContext";
import { Link } from "react-router-dom";
import Auth from "../../modules/Auth";

class NavBar extends React.Component {
  componentDidMount() {
    if (Auth.isUserAuthenticated) {
      this.props.Context.setUser();
    }
  }

  render() {
    const authenticated = Auth.isUserAuthenticated();
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-md navbar-dark  bg-dark">
          <div className="d-flex">
            <ul className="navbar-nav mr-auto">
              {authenticated && (
                <li className="nav-item text-light">
                  <Link to="/">Home</Link>
                </li>
              )}
              {authenticated && (
                <li className="nav-item text-light">
                  <Link className=" text-light p-2 bd-highlight" to="/account">
                    AccountPage
                  </Link>
                </li>
              )}

              <li className="nav-item text-light">
                <Link className=" text-light p-2 bd-highlight" to="/signup">
                  Sign up
                </Link>
              </li>
              <li className="nav-item text-light ${isActiveClasses">
                <Link className=" text-light p-2 bd-highlight" to="/login">
                  Login
                </Link>
              </li>
              {authenticated && (
                <li className="nav-item text-light">
                  <Link className=" text-light p-2 bd-highlight" to="/logout">
                    Log out
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}
export default withContext(NavBar);
