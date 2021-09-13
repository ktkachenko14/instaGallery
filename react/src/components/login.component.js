import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AuthService from "../services/auth.service";
import Button from '@material-ui/core/Button';
import { CardActionArea, CardMedia } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import Typography from '@material-ui/core/Typography';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Paper from '@material-ui/core/Paper';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import LinkedCameraIcon from '@material-ui/icons/LinkedCamera';
import FavoriteIcon from '@material-ui/icons/Favorite';
//import { Button } from "bootstrap";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.handleMouseDownPassword = this.handleMouseDownPassword.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    
  

    this.state = {
      email: "",
      password: "",
      loading: false,
      message: "",
      showPassword: false
    };
  }

  
  handleClickShowPassword(){
    this.setState({
      showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword (event){
    event.preventDefault();
  };

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

  handleRegistration(){
    this.props.history.push("/register");
    window.location.reload();
  }

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.email, this.state.password).then(
        () => {
          this.props.history.push("/profile");
          window.location.reload();
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            loading: false,
            message: resMessage
          });
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    return (
      <>
          <Form 
            onSubmit={this.handleLogin}
            ref={c => {
              this.form = c;
            }}
          >
            <div className="form-group" marginTop="20px">
              <div className="row mb-3">
              <div className="col-md-6">
              <React.Fragment>
              <Timeline align="alternate">
                <TimelineItem>
                    <TimelineOppositeContent>
                      <Typography variant="body2" color="textSecondary">
                          1 step
                      </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot>
                        <AccountCircleIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} style={{padding: '6px 16px'}}>
                        <Typography >
                          Sign up
                        </Typography>
                      </Paper>
                    </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineOppositeContent>
                    <Typography variant="body2" color="textSecondary">
                      2 step
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="primary">
                      <ContactMailIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={3} style={{padding: '6px 16px'}}>
                      <Typography>
                        Confirm email
                      </Typography>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                    <TimelineOppositeContent>
                      <Typography variant="body2" color="textSecondary">
                          3 step
                      </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="secondary">
                        <LaptopMacIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} style={{padding: '6px 16px'}}>
                        <Typography>
                          Sign in account
                        </Typography>
                      </Paper>
                    </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineOppositeContent>
                    <Typography variant="body2" color="textSecondary">
                      4 step
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="inherit">
                      <LinkedCameraIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={3} style={{padding: '6px 16px'}}>
                      <Typography>
                        Add photos
                      </Typography>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                <TimelineOppositeContent>
                      <Typography variant="body2" color="textSecondary">
                          5 step
                      </Typography>
                    </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="secondary">
                      <FavoriteIcon />
                    </TimelineDot>
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={3} style={{padding: '6px 16px'}}>
                      <Typography >
                      Find new ideas for inspiration
                      </Typography>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </React.Fragment>
              </div>
              <div className="col-md-6" >
                <h3 style={{ margin: 20 }}>InstaGallery</h3>
              <div className="col-12" style={{ margin: 8 }}>
              <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={this.state.email}
              onChange={this.onChangeEmail}
              validations={[required]}
          />
              </div>
              <div className="col-12" style={{ margin: 8 }}>
              <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={this.state.password}
                  onChange={this.onChangePassword}
                  validations={[required]}
              />
                
              </div>
              
                

              <div className="form-group" style={{ margin: 20 }}>
              <Button onClick={this.handleLogin}
                variant="contained"
                 color="secondary" 
                disabled={this.state.loading}  
                fullWidth
                style={{left: 10}}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                Login
              </Button>
            </div>

            {this.state.message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
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
              <div className="form-group">
                <div className="d-flex justify-content-center">
                  <label style={{ margin: 10 }}>Don't have an account yet?</label>  
                  <Button color="secondary"
                  onClick={this.handleRegistration}>
                    Sign up
                  </Button>
                </div>
              
              </div>
            </div>
            
            </div>
            </div>
            
              
            
            
          </Form>
   
      </>
      
    );
  }
}