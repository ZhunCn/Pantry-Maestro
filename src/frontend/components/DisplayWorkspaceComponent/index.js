import React from "react";
import "./styles.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Button, Modal } from "semantic-ui-react";

export default class DisplayWorkspaceComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: this.props.user_id,
      works: ["", ""],
      field: 0
    };
  }
  checkAndLeave(id) {
    console.log("ID" + id);
    let userLoginToken = localStorage.getItem("loginToken");
    let userID = this.props.user_id;
    axios.get(`api/workspaces/${id}/users`, {
      headers: {
        Authorization: `${userLoginToken}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.data.users.length > 1) {
        axios.get(`/api/workspaces/${id}/users/${userID}`, {
          headers: {
            Authorization: `${userLoginToken}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }).then(res => {
          this.handleLeave(id);
        });
        this.closeAll(id);
      } else {
        this.closeAll(id);
        this.open3(id);
      }
    });
  }
  handleLeave(id) {
    console.log("LEAVE ID: " + id);
    let userLoginToken = localStorage.getItem("loginToken");
    axios.post("/api/account/leave",
      {
        workspace_id: `${id}`
      },
      {
        headers: {
          Authorization: `${userLoginToken}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
    }).then(res => {
        if (res.data.error == "You can't leave the workspace if you're the last member in it") {
          toast(res.data.error + ". Try deleting the workspace instead.", {type: "warning"});
        }
        else if(res.data.error == "You cannot leave a workspace if you are the owner"){
          toast(res.data.error +". Transfer the ownership to another person first.", {type:"warning"});
        }
        else {
          toast("User has left the workspace", { type: "success" });
          if (id == localStorage.getItem("currWorkspaceID")) {
            localStorage.setItem("currWorkspaceID", "");
          }
          this.props.getInfo();
        }
    }).catch(error => {
        toast(error.message, { type: "error" });
        this.props.getInfo();
      });
    this.closeAll(id);
  }
  handleDelete(id) {
    console.log("DELETE ID: " + id);
    let userLoginToken = localStorage.getItem("loginToken");
    let userID = this.props.user_id;
    axios.delete(`/api/workspaces/${id}`, {
        headers: {
          Authorization: `${userLoginToken}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }).then(res => {
        if (res.data.error ==="There was an error deleting the workspace: Insufficient permissions") {
          toast("The workspace was not deleted. Only the owner may delete the workspace",{ type: "error" });
        }
        else {
          toast("The workspace has been successfully deleted", {type: "success"});
          if (id == localStorage.getItem("currWorkspaceID")) {
            localStorage.setItem("currWorkspaceID", "");
          }
          this.props.getInfo();
        }
      }).catch(error => {
        toast(error.message, { type: "error" });
        this.props.getInfo();
        console.log(error.message);
      });
    this.closeAll(id);
  }
  checkDelete(id) {
    if (this.props.names.length == 1 && this.props.names[0][0] != "") {
      console.log("This is your last workspace.");
      this.closeAll(id);
      this.setState({ field: 0, ["open4" + id]: true });
    } else {
      this.handleDelete(id);
    }
  }
  checkLeave(id) {
    if (this.props.names.length == 1 && this.props.names[0][0] != "") {
      console.log("This is your last workspace.");
      this.closeAll(id);
      this.setState({ field: 1, ["open4" + id]: true });
    } else {
      this.handleLeave(id);
    }
  }
  makeList(items) {
    return <ul>{items.map((item, i) => this.listItem(item))}</ul>;
  }
  closeAll = id => {
    console.log(this.state);
    this.close1(id);
    this.close2(id);
    this.close3(id);
    this.close4(id);
  };
  open1 = id => {
    this.setState({ ["open1" + id]: true });
  };
  close1 = id => {
    this.setState({ ["open1" + id]: false });
  };
  open2 = id => {
    this.setState({ ["open2" + id]: true });
  };
  close2 = id => {
    this.setState({ ["open2" + id]: false });
  };
  open3 = id => {
    this.setState({ ["open3" + id]: true });
  };
  close3 = id => {
    this.setState({ ["open3" + id]: false });
  };
  open4 = id => {
    this.setState({ ["open4" + id]: true });
  };
  close4 = id => {
    this.setState({ ["open4" + id]: false });
  };
  setCurrentWorkspace(id) {
    localStorage.setItem("currWorkspaceID", id);
    this.props.getInfo();
  }
  refreshModal(value) {
    this.setState({ works: value });
  }
  listItem(value) {
    var name = value[0];
    let workspaceID = localStorage.getItem("currWorkspaceID");
    var isCurr = value[1] == workspaceID;
    if (isCurr) {
      name = <strong>{value[0]} (current workspace)</strong>;
    }
    let openState = "open" + value[1];
    return (
      <li key={value[1]}>
        {name}
        {isCurr ? null : (
          <Button
            style={{ marginLeft: 5 }}
            size="small"
            onClick={() => this.setCurrentWorkspace(value[1])}
          >
            Set Workspace
          </Button>
        )}
        <br />
        <Modal
          id={value[1]}
          style={{ height: 200 }}
          open={this.state["open1" + value[1]]}
          onOpen={() => this.open1(value[1])}
          onClose={() => this.closeAll(value[1])}
          size="small"
          trigger={
            <Button size="small" onClick={() => this.refreshModal(value)}>
              Leave Workspace
            </Button>
          }
        >
          <Modal.Header>Leave Workspace?</Modal.Header>
          <div class="contain" style={{ margin: 20 }}>
            <strong>
              Are you sure you want to leave {this.state.works[0]}?
            </strong>
            <br />
            <Button onClick={() => this.checkAndLeave(this.state.works[1])}>
              Leave Workspace
            </Button>
            <Button onClick={() => this.closeAll(value[1])}>
              Do not leave Workspace
            </Button>
          </div>
        </Modal>
        <Modal
          style={{ height: 200 }}
          open={this.state["open2" + value[1]]}
          onOpen={() => this.open2(value[1])}
          onClose={() => this.closeAll(value[1])}
          size="small"
          trigger={
            <Button size="small" onClick={() => this.refreshModal(value)}>
              Delete Workspace
            </Button>
          }
        >
          <Modal.Header>Delete Workspace?</Modal.Header>
          <div class="contain" style={{ margin: 20 }}>
            <strong>
              Are you sure you want to delete {this.state.works[0]}?
            </strong>
            <br />
            <Button onClick={() => this.checkDelete(this.state.works[1])}>
              Delete Workspace
            </Button>
            <Button onClick={() => this.closeAll(value[1])}>
              Do not delete Workspace
            </Button>
          </div>
        </Modal>
        <Modal
          style={{ height: 200 }}
          open={this.state["open3" + value[1]]}
          onOpen={() => this.open3(value[1])}
          onClose={() => this.closeAll(value[1])}
          size="tiny"
        >
          <Modal.Header>Leave Workspace?</Modal.Header>
          <div class="contain" style={{ margin: 20 }}>
            <strong>
              You are the only user in the workspace.
              <br />
              If you leave, this workspace will be deleted.
              <br />
              Are you sure you want to leave {this.state.works[0]}?
            </strong>
            <br />
            <Button onClick={() => this.checkDelete(this.state.works[1])}>
              Delete Workspace
            </Button>
            <Button onClick={() => this.closeAll(value[1])}>
              Do not delete Workspace
            </Button>
          </div>
        </Modal>
        <Modal
          style={{ height: 200 }}
          open={this.state["open4" + value[1]]}
          onOpen={() => this.open4(value[1])}
          onClose={() => this.closeAll(value[1])}
          size="tiny"
        >
          <Modal.Header>Leave last Workspace?</Modal.Header>
          <div class="contain" style={{ margin: 20 }}>
            <strong>
              This is your only workspace.
              <br />
              If you {this.state.field ? "leave" : "delete"} this workspace, you
              will not have any workspaces left.
              <br />
              Are you sure you want to {this.state.field
                ? "leave"
                : "delete"}{" "}
              {this.state.works[0]}?
            </strong>
            <br />
            <Button
              onClick={() =>
                this.state.field
                  ? this.handleLeave(this.state.works[1])
                  : this.handleDelete(this.state.works[1])
              }
            >
              {this.state.field ? "Leave" : "Delete"} Workspace
            </Button>
            <Button onClick={() => this.closeAll(value[1])}>
              Do not {this.state.field ? "leave" : "delete"} Workspace
            </Button>
          </div>
        </Modal>
      </li>
    );
  }

  render() {
    return (
      <div>
        <strong>Workspaces you are enrolled in</strong>
        {(this.props.names.length==1 && !this.props.names[0][0]) ? (
          <ul>None</ul>
        ) : (
          this.makeList(this.props.names)
        )}
      </div>
    );
  }
}
