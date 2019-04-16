import React from "react";
import "./styles.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Button, Modal } from "semantic-ui-react";

export default class DisplayVolunteerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: this.props.userID,
      open1: false,
      open2: false,
      open3: false,
      volunteers: this.props.volunteers,
      curWorkspace: "",
      isOwner: this.props.isOwner,
      curVolun: "",
      curID: ""
    };
  }
  refreshModal(value) {
    this.setState({ curVolun: value });
  }
  makeList(items) {
    return <ul>{items.map((item, i) => this.listItem(item))}</ul>;
  }
  open1 = () => this.setState({ open1: true });
  close1 = () => this.setState({ open1: false });
  open2 = () => this.setState({ open2: true });
  close2 = () => this.setState({ open2: false });
  open3 = () => this.setState({ open3: true });
  close3 = () => this.setState({ open3: false });
  closeAll = () => this.setState({ open1: false, open2: false, open3: false });
  handleRemove(id) {
    console.log("Remove: " + id);
    let userLoginToken = localStorage.getItem("loginToken");
    let workID = localStorage.getItem("currWorkspaceID");
    axios.delete(`/api/workspaces/${workID}/users/${id}`, {
      headers: {
        Authorization: `${userLoginToken}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.data.message == "Successfully deleted user from workspace") {
        toast(res.data.message, { type: "success" });
      } else {
        toast(res.data.error, { type: "error" });
      }
      this.props.getInfo();
    });
    this.closeAll();
  }
  handleTransfer(id) {
    console.log("Transfer to: " + id);
    let workID = localStorage.getItem("currWorkspaceID");
    let userLoginToken = localStorage.getItem("loginToken");
    axios.post(`/api/workspaces/${workID}/transfer`, {
      user_id: `${id}`
    },
    {
      headers: {
        Authorization: `${userLoginToken}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.data.message == "Successfully updated roles") {
        toast(res.data.message, { type: "success" });
      } else {
        toast(res.data.error, { type: "error" });
      }
      this.props.getInfo();
    });
    this.closeAll();
  }
  handleMakeAdmin(id) {
    console.log("Make admin: " + id);
    console.log("This function hasn't been implemented yet");
    toast("Nothing happened because this wasn't implemented yet", {type: "warning"});
    this.closeAll();
  }
  refreshModal(name, id) {
    this.setState({ curVolun: name, curID: id });
  }
  listItem(value) {
    var name = value.account.username;
    let workspaceID = localStorage.getItem("currWorkspaceID");
    let isSelf = value.account._id == this.props.userID;
    if (this.props.isOwner && !isSelf) {
      return (
        <li>
          {name}
          <br />
          <Modal
            style={{ height: 280 }}
            open={this.state.open1}
            onOpen={this.open1}
            onClose={this.closeAll}
            size="small"
            trigger={
              <Button size="small" onClick={() => this.refreshModal(name, value.account._id)}>
                Remove from Workspace
              </Button>
            }
          >
            <Modal.Header>
              Remove from workspace?
            </Modal.Header>
            <div class="contain" style={{ margin: 20 }}>
              <strong>
                Are you sure you want to remove <i>{this.state.curVolun}</i>{" "}
                from <i>{this.props.name}</i>?
              </strong>
              <br />
              <Button onClick={() => this.handleRemove(this.state.curID)}>
                Remove from workspace
              </Button>
              <Button onClick={this.closeAll}>
                Do not remove from Workspace
              </Button>
            </div>
          </Modal>
          <Modal
            style={{ height: 280 }}
            open={this.state.open2}
            onOpen={this.open2}
            onClose={this.closeAll}
            size="small"
            trigger={
              <Button size="small" onClick={() => this.refreshModal(name, value.account._id)}>
                Make Admin
              </Button>
            }
          >
            <Modal.Header>Make admin of workspace?</Modal.Header>
            <div class="contain" style={{ margin: 20 }}>
              <strong>
                Are you sure you want to make <i>{this.state.curVolun}</i> an
                administrator of <i>{this.props.name}</i>?
              </strong>
              <br />
              <Button onClick={() => this.handleMakeAdmin(this.state.curID)}>
                Make admin
              </Button>
              <Button onClick={this.closeAll}>Do not make admin</Button>
            </div>
          </Modal>
          <Modal
            style={{ height: 280 }}
            open={this.state.open3}
            onOpen={this.open3}
            onClose={this.closeAll}
            size="small"
            trigger={
              <Button size="small" onClick={() => this.refreshModal(name, value.account._id)}>
                Transfer ownership
              </Button>
            }
          >
            <Modal.Header>Transfer Ownership of workspace?</Modal.Header>
            <div class="contain" style={{ margin: 20 }}>
              <strong>
                Are you sure you want to make <i>{this.state.curVolun}</i> the
                owner of <i>{this.props.name}</i>? This action cannot be undone on your end.
              </strong>
              <br />
              <Button onClick={() => this.handleTransfer(this.state.curID)}>
                Transfer Ownership
              </Button>
              <Button onClick={this.closeAll}>Do not transfer ownership</Button>
            </div>
          </Modal>
        </li>
      );
    } else {
      return <li>{name}</li>;
    }
  }

  render() {
    return (
      <div>
        <strong>Volunteers in current workspace</strong>
        {this.props.volunteers[0] != "" ||!this.props.volunteers? (
          this.makeList(this.props.volunteers)
        ) : (
          <ul>None</ul>
        )}
      </div>
    );
  }
}
