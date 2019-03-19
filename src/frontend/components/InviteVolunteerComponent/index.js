import React from 'react';
import './styles.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { Form, Button } from 'semantic-ui-react'

export default class InviteVolunteerComponent extends React.Component {
  constructor(props) {
      super(props);
      //email: email of invitee
      this.state = {
          email: "",
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
      this.setState({
          email: e.target.value
      })
  }

  handleSubmit(e) {
      e.preventDefault();
      const workspaceID = localStorage.getItem("currWorkspaceID");
      axios.post(`/api/workspaces/${workspaceID}/invites`, {
          'email': this.state.email
      }).then(res => {
          toast(this.state.email+" has been sent an invitation", { type: "success" });
          console.log(res.data);
      }).catch(error => {
          toast(error.data, { type: "error" });
          console.log(error.data);
      });
  }

  render() {
      return (
          <div>
              <ToastContainer autoClose={3000} />
              <strong>Send an invitation to the current workspace</strong>
              <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                  <label>Email:</label>
                  <input placeholder="email" type="text" class="email" value={this.state.email} onChange={this.handleChange} />
                </Form.Field>
                <Button type="submit">Submit </Button>
              </Form>
          </div>
      )

  }
}
