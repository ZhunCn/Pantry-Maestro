import React from 'react';
import './styles.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'


export default class AddWorkspaceComponent extends React.Component {
    constructor(props) {
        super (props);
        this.state = {
            newWorkspaceName: ""
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
        axios.post("/api/workspaces", {
            name: this.state.newWorkspaceName
        }).then(res => {
            if (res.status === 200) {
                toast("The workspace has been successfully created!", { type: "success" });
                console.log(res.data.workspace_id);
                localStorage.setItem("currWorkspaceID", res.data.workspace_id);
            }
        })
        axios.get("/api/workspaces", {
            params: {
                name: this.state.newWorkspaceName
            }
        }).then(res => {
            localStorage.setItem("currWorkspaceID", res.data._id);
            console.log(res.data._id)
        })
    }

    render() {
        return (
            <div>
                <ToastContainer autoClose={3000}/>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name:
                        <input type="text" class="workspaceTextInput" value={this.state.newWorkspaceName} onChange={this.handleChange}/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )

    }
}