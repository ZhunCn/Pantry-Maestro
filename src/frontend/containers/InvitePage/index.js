import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authorize } from '@/utils';

import './styles.scss';


const initialState = {
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  usernameError: false,
  passwordError: false,
  confirmPasswordError: false,
  passwordMatchError: false,
  emailError: false,
  createUserError: false,
}


export default class Invite extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.onInputChange = this.onInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    let error = false;

    // Grab username and password from field
    let username = this.state.username;
    let email = this.state.email;
    let password = this.state.password;
    let confirmPassword = this.state.confirmPassword;

    console.log('Inputted username (signUpProcedure): ', username);
    console.log('Inputted email (signUpProcedure): ', email);
    console.log('Inputted password (signUpProcedure): ', password);
    console.log('Inputted password #2 (signUpProcedure): ', confirmPassword);

    // this.verifyUser(this.state.username);
    if (username.length == 0 || username.length > 32) {
      this.setState({ usernameError: true });
      toast("Invalid username! Usernames must be less than 32 characters in length", { type: "error" });
      return;
    } else {
      this.setState({ usernameError: false });
    }

    // this.verifyPass(this.state.password);
    if (password.length <= 6) {
      this.setState({ passwordError: true })
      toast("Invalid password! Make sure your password contains at least 1 number and is longer than 6 characters", { type: "error" });
      return;
    }
    //check that password has letters AND numbers
    //modular regex design
    let letters = /[a-zA-Z]+/;
    let numbers = /[0-9]+/;

    if (password.match(letters) == null || password.match(numbers) == null) {
      this.setState({ passwordError: true })
      toast("Invalid password! Make sure your password contains at least 1 number and is longer than 6 characters", { type: "error" });
      return;
    }

    this.setState({ passwordError: false })

    // this.verifyEmail(this.state.email);
    let emailregex = RegExp("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}");

    //check if email looks like an email
    if (!emailregex.test(email)) {
      this.setState({ emailError: true })
      toast("Invalid email", { type: "error" });
      return;
    } else {
      this.setState({ emailError: false });
    }
    console.log("after:");
    console.log(this.state);
    if (password == confirmPassword) {
      if (!this.state.emailError) {
        console.log('Valid email!');
        if (!this.state.usernameError) {
          console.log('Valid username!');
          if (!this.state.passwordError) {
            console.log('Valid password!');
            // Connect with backend to register account
            let self = this;
            axios.post('/api/auth/register', {
              'email': email,
              'username': username,
              'password': password
            }).then(res => {
              console.log(res.data);

              self.props.history.push("/login/" + self.props.match.params.token);
            })
              .catch((error) => {
                console.log(error.data);
                return;
              });

            // Log into the newly made account, then procede to add account to workspace

          } else {
            console.log('Invalid password! Make sure your password contains at least 1 number and is longer than 6 characters');
          }
        } else {
          console.log('Invalid username! Usernames must be less than 32 characters in length');

        }
      } else {
        console.log('Invalid email!');
      }
    } else {
      console.log('Passwords do not match, check again');
      toast("Passwords do not match, check again", { type: "error" });
      this.setState({ passwordMatchError: true });
    }
  }

  confirmProcedure() {
    // TODO: Implement add to workplace
    console.log('Invite: ' + this.state.inviteToken);
    console.log('Id: ' + localStorage.getItem("userId"));

    let self = this;
    axios.post("/api/workspaces/invites/join", {
      'invite': self.state.inviteToken,
      'user_id': localStorage.getItem("userId")
    }).then(res => {
      console.log(res);
      if (res.data.err) {
        toast("There was an error joining the workspace", { type: "error" });
        return;
      }
      else {
        self.props.history.push('/inventory');
      }
    });
  }

  denyProcedure() {
    this.props.history.push('/inventory');  
  }

  onInputChange(event) {
    console.log(event);
    this.state.setState
    this.setState({ [event.target.name]: event.target.value })
  }

  getCurrentUsername() {
    console.log("Grabbing current Username!");
    let userLoginToken = localStorage.getItem("loginToken");
    let self = this;
    axios.get("/api/account", { headers: { "Authorization": `${userLoginToken}` } })
      .then(res => {
        console.log(res.data.username);
        localStorage.setItem("userId", res.data._id);
        self.setState({'userId': res.data._id});
        document.getElementById("currentUser").textContent = res.data.username;
      });
  }

  componentDidMount() {
    if (authorize()) {
      this.getCurrentUsername();
    }

    this.setState({'inviteToken': this.props.match.params.token});
  }

  

  render() {
    
    if (authorize()) {
      return (

        <div class="invitePage">
          <div class="Content">
            <center>
              <h2>You have been invited to a Pantry Workplace!<span id="workspaceLbl"></span></h2>
              <p>You are already signed in as: <span id="currentUser"></span></p>

              <p>Would you like to join the pantry?</p>
              <p><button id="confirmButton" class="button" onClick={(e) => this.confirmProcedure()}>Accept</button>
                <button id="cancelButton" class="button" onClick={(e) => this.denyProcedure()}>Decline</button></p>
            </center>
            <div class="Footer"></div>
            <div class="Flex">
            </div>
          </div>

        </div>

      )
    } else {
      return (
        <div class="invitePage">
          <div class="Content">
            <center>
              <h2>You have been invited to a Pantry Workplace!<span id="workspaceLbl"></span></h2>

              <p>Not already a member in Pantry Maestro? Sign up here!</p>
              <ToastContainer autoClose={3000} />
              <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle' className='middle aligned'>
                <Grid.Column style={{ maxWidth: 450 }}>
                  <Form size='large' onSubmit={(e) => { this.handleSubmit(e) }} error={this.state.createUserError}>
                    <Segment stacked>
                      <Form.Field>
                        <label>Username</label>
                        <Form.Input
                          name="username"
                          fluid
                          icon='user'
                          iconPosition='left'
                          placeholder='Username'
                          value={this.state.username}
                          onChange={this.onInputChange}
                          error={this.state.usernameError} />
                      </Form.Field>
                      <Form.Field>
                        <label>Password</label>
                        <Form.Input
                          name="password"
                          fluid
                          icon='lock'
                          iconPosition='left'
                          placeholder='Password'
                          type='password'
                          value={this.state.password}
                          onChange={this.onInputChange}
                          error={this.state.passwordError || this.state.passwordMatchError}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Confirm Password</label>
                        <Form.Input
                          name="confirmPassword"
                          fluid
                          icon='lock'
                          iconPosition='left'
                          placeholder='Confirm Password'
                          type='password'
                          value={this.state.confirmPassword}
                          onChange={this.onInputChange}
                          error={this.state.confirmPasswordError || this.state.passwordMatchError}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Email</label>
                        <Form.Input
                          name='email'
                          fluid
                          icon='mail'
                          iconPosition='left'
                          placeholder='Email'
                          value={this.state.email}
                          onChange={this.onInputChange}
                          error={this.state.emailError}
                        />
                      </Form.Field>
                      <Form.Button fluid size='large' type='submit' disabled={!this.state.username
                        || !this.state.password
                        || !this.state.confirmPassword
                        || !this.state.email}>
                        Sign Up
                </Form.Button>
                    </Segment>
                  </Form>
                  <Message>
                    <Link to={"/login/" + this.props.match.params.token}><Button id="loginButton">Already Have an account? Log In</Button></Link>
                  </Message>
                </Grid.Column>
              </Grid>

            </center>
          </div>

        </div>
      );
    }


  }
};
