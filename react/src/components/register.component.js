import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import TextField from '@material-ui/core/TextField';
import AuthService from "../services/auth.service";
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const email = value => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const defaultImageSrc = '/img/icons.png';

const responseGoogle = (response) => {
  console.log(response);
}

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.showPreview = this.showPreview.bind(this);

    this.state = {
      username: "",
      email: "",
      password: "",
      imageName: '',
      imageSrc: defaultImageSrc,
      imageFile: null,
      successful: false,
      message: "",
      sendingEmail: false
    };
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  showPreview(e){
    if(e.target.files && e.target.files[0]){
      let imageFile = e.target.files[0];
      const reader =  new FileReader();
      reader.onload = x=>{
        this.setState({
          imageFile,
          imageSrc: x.target.result
        });
      }
      reader.readAsDataURL(imageFile);
    }
    else{
      this.setState({
        imageFile: null,
        imageSrc: defaultImageSrc
      });
    }
    
  }


  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false,
      sendingEmail: false
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(
        this.state.username,
        this.state.email,
        this.state.password
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true,
            sendingEmail:  true
          });
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage,
            sendingEmail: false
          });
        }
      );
    }
  }

  
  render() {
    return (
     <>
<div className="registration">
          <Form enctype="multipart/form-data"
            onSubmit={this.handleRegister}
            ref={c => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div className="justify-content-center">
                <div className="form-group ">
                <div class="d-flex justify-content-center">
                
                  <Chip
                    icon={<FaceIcon />}
                    label="Create your account"
                    clickable
                    color="primary"
                    fullWidth
                  />
                  </div>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    
                    type="text"
                    className="form-control"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    validations={[required, vusername]}
                  />
                </div>

                <div className="form-group">
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    type="text"
                    className="form-control"
                    name="email"
                    label="Email"
                    autoComplete="email"
                    autoFocus
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                    validations={[required, email]}
                  />
                </div>

                <div className="form-group">
                  <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                    type="password"
                    className="form-control"
                    name="password"
                    label="Password"
                    autoComplete="password"
                    autoFocus
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    validations={[required, vpassword]}
                  />
                </div>

                <div className="form-group">
                  <Button variant="contained"
                 color="secondary" fullWidth
                 type="submit"
                 style={{ top: 20 }}
                 >Sign Up</Button>
                </div>
              </div>
            )}

            {this.state.message && (
              <div className="form-group">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
            {this.state.sendingEmail && (
              <div className="form-group">
                <h2>Confirm your email - {this.state.email}</h2>
              </div>
            )}
          </Form>
          </div>
       </>
    );
  }
}