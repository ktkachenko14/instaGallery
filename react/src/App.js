import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile";
import Image from "./components/post";
import FileUpload from "./components/FileUpload";
import ImageList from "./components/imageList";
import UpdateUser from "./components/updateUser";


import ExitToAppIcon from '@material-ui/icons/ExitToApp';


class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser} = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light" >
          <div className="navbar-nav mr-auto">
           

            {currentUser && (
            <li className="nav-item">
              <Link to={"/list"} className="nav-link">
                List
              </Link>
            </li>
             )}

          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item" id="profilePage">
                <Link to={"/profile"} className="nav-link" >
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                <ExitToAppIcon color="secondary"/>
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/","/login"]} component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/post" component={FileUpload} />
            <Route exact path="/list" component={ImageList} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/updateProfile" component={UpdateUser} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;