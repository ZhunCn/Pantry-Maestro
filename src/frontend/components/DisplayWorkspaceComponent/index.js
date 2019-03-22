import React from 'react';
import './styles.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Button, Modal } from 'semantic-ui-react';


export default class DisplayWorkspaceComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: this.props.user_id,
      open1: false,
      open2: false,
      works: ['', ''],
      noCurr: false
    };
  }
  handleLeave(id) {
    console.log("LEAVE ID: " + id);
    if (id == localStorage.getItem("currWorkspaceID")) {
      localStorage.setItem("currWorkspaceID", "");
    }
    let userLoginToken = localStorage.getItem("loginToken");
    axios.post('/api/account/leave',
      {
        "workspace_id": `${id}`
      },
      {
        headers: { "Authorization": `${userLoginToken}` }
      }).then(() => {
        toast("User has left the workspace", { type: "success" });
        this.props.getInfo();
      }).catch(error => {
        console.log(error.message);
        toast(error.message, { type: "error" });
        this.props.getInfo();
      });
    this.close1();
  }
  handleDelete(id) {
    console.log("DELETE ID: " + id);
    if (id == localStorage.getItem("currWorkspaceID")) {
      localStorage.setItem("currWorkspaceID", "");
    }
    let userLoginToken = localStorage.getItem("loginToken");
    axios.post('/api/account/leave',
      {
        "workspace_id": `${id}`
      },
      {
        headers: { "Authorization": `${userLoginToken}` }
      }).catch(error => {
        console.log(error.message);
        toast(error.message, { type: "error" });
      });
    axios.delete(`/api/workspaces/${id}`,
      {
        headers: { "Authorization": `${userLoginToken}` }
      }).then(() => {
        toast("The workspace has been successfully deleted", { type: "success" });
        this.props.getInfo();
      }).catch(error => {
        toast(error.message, { type: "error" });
        console.log(error.message);
      });
    this.close2();
  }
  makeList(items) {
    return (<ul>
      {
        items.map((item, i) => this.listItem(item))
      }
    </ul>);
  }
  open1 = () => this.setState({ open1: true })
  close1 = () => this.setState({ open1: false })
  open2 = () => this.setState({ open2: true })
  close2 = () => this.setState({ open2: false })
  setCurrentWorkspace(id) {
    localStorage.setItem("currWorkspaceID", id);
    this.setState({ state: this.state });
  }
  refreshModal(value) {
    this.setState({ works: value });
  }
  listItem(value) {
    var name = value[0];
    let workspaceID = localStorage.getItem("currWorkspaceID");
    var isCurr = value[1] == workspaceID;
    if (isCurr) {
      name = (<strong>{value[0]} (current workspace)</strong>);
    }
    return (<li>
      {name}
      {isCurr ?
        null :
        <Button style={{ marginLeft: 5 }} size='small' onClick={() => this.setCurrentWorkspace(value[1])}>setWorkspace</Button>
      }
      <br />
      <Modal
        open={this.state.open1}
        onOpen={this.open1}
        onClose={this.close1}
        size="small"
        trigger={<Button size='small' onClick={() => this.refreshModal(value)}>Leave Workspace</Button>}>
        <Modal.Header>Leave Workspace?</Modal.Header>
        <div class="contain" style={{ margin: 20 }}>
          <strong>Are you sure you want to leave {this.state.works[0]}?</strong><br />
          <Button onClick={() => this.handleLeave(this.state.works[1])}>Leave Workspace</Button>
          <Button onClick={this.close1}>Do not leave Workspace</Button>
        </div>
      </Modal>
      <Modal
        open={this.state.open2}
        onOpen={this.open2}
        onClose={this.close2}
        size="small"
        trigger={<Button size='small' onClick={() => this.refreshModal(value)}>Delete Workspace</Button>}>
        <Modal.Header>Delete Workspace?</Modal.Header>
        <div class="contain" style={{ margin: 20 }}>
          <strong>Are you sure you want to delete {this.state.works[0]}?</strong><br />
          <Button onClick={() => this.handleDelete(this.state.works[1])}>Delete Workspace</Button>
          <Button onClick={this.close2}>Do not delete Workspace</Button>
        </div>
      </Modal>
    </li>);
  }

  render() {
    return (
      <div>
        <ToastContainer autoClose={3000} />
        <strong>Workspaces you are enrolled in</strong>
        {this.props.names[0][0] != '' ?
          this.makeList(this.props.names)
          : <ul>None</ul>
        }
      </div>
    )
  }
}
