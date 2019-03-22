import React from 'react';
import './styles.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { Form, Input, Button, Icon, Modal } from 'semantic-ui-react'

export default class AddWorkspaceComponent extends React.Component {
  componentDidMount(){
    let userLoginToken = localStorage.getItem("loginToken");
    axios.get("/api/account", { headers: { "Authorization" : `${userLoginToken}` } }).then(res => {
        this.setState({
          user_id: res.data._id
        });
        console.log(res.data);
    });
  }
    constructor(props) {
        super(props);
        this.state = {
            newWorkspaceName: "",
            user_id: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            newWorkspaceName: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        let userLoginToken = localStorage.getItem("loginToken");
        axios.post("/api/workspaces", {
            name: this.state.newWorkspaceName
          }, { headers: { "Authorization": `${userLoginToken}`,
          'Accept' : 'application/json',
          'Content-Type': 'application/json' }
          }).then(res => {
            if (res.status === 200) {
                toast("The workspace has been successfully created!", { type: "success" });
                console.log(res.data.workspace_id);
                localStorage.setItem("currWorkspaceID", res.data.workspace_id);
            }
        }).catch(error => {
            if (error.response.data.error === "A workspace with that name already exists") {
                toast("A workspace with that name already exists!", { type: "error" });
            }
        }).then(()=>{
          let workspaceID = localStorage.getItem("currWorkspaceID");
          let workSpJson = {
  	          "user_id": this.state.user_id,
  	          "roles": "coordinator"
          }
          axios.post(`/api/workspaces/${workspaceID}/users`,
            workSpJson,
          { headers: { "Authorization": `${userLoginToken}`,
            'Accept' : 'application/json',
            'Content-Type': 'application/json' }
          }).then(res => {
              toast("Successfully added user to workspace", {type: "success"})
              this.props.getInfo();
              console.log(res.data);
          }).catch(error => {
            toast("Failed to add user to workspace", {type: "error"})
            console.log(error);
          })
        });
    }

    render() {
        return (
            <div>
                <ToastContainer autoClose={3000} />
                <strong>Create a workspace</strong>
                <Form onSubmit={this.handleSubmit}>
                  <Form.Field>
                    <label>Name:</label>
                    <input type="text" class="workspaceTextInput" value={this.state.newWorkspaceName} onChange={this.handleChange} />
                  </Form.Field>
                  <Button type="submit">Submit </Button>
                </Form>
            </div>
        )

    }
}
