import React from "react";
import "./styles.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Form, Button, Input } from "semantic-ui-react";

export default class InviteVolunteerComponent extends React.Component {
  constructor(props) {
    super(props);
    //email: email of invitee
    this.state = {
      email: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      email: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const workspaceID = localStorage.getItem("currWorkspaceID");
    const userLoginToken = localStorage.getItem("loginToken");
    axios.post(`/api/workspaces/${workspaceID}/invites`,
        { email: this.state.email },
        {
          headers: {
            Authorization: `${userLoginToken}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      )
      .then(res => {
        toast(this.state.email + " has been sent an invitation", {type: "success"});
        this.setState({email: ''});
      }).catch(error => {
        toast(error.message, { type: "error" });
      });
  }

  render() {
    return (
      <div style={{"margin-top": 20}}>
        <div style={{"margin-bottom": 10}}>
          <h3>Send an invitation to the current workspace</h3>
        </div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field fluid>
            <Input
              label="Email"
              placeholder="Email"
              type="text"
              class="email"
              value={this.state.email}
              onChange={this.handleChange}
              action={<Button type="submit">Submit</Button>}
            />
          </Form.Field>
        </Form>
      </div>
    );
  }
}
