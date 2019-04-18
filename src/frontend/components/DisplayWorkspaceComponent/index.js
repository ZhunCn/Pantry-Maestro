import React from "react";
import "./styles.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Button, Modal, Grid, List } from "semantic-ui-react";

export default class DisplayWorkspaceComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: this.props.user_id,
      works: ["", ""],
      field: 0,
      open1: false,
      open2: false,
      open3: false,
      open4: false,
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
        this.closeAll();
      } else {
        this.closeAll();
        this.open3();
      }
    });
  }
  handleLeave(id) {
    sessionStorage.setItem("shoppingList", "");
    sessionStorage.setItem("idList", "");
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
          toast(res.data.error + ". Try deleting the workspace instead.", { type: "warning" });
        }
        else if (res.data.error == "You cannot leave a workspace if you are the owner") {
          toast(res.data.error + ". Transfer the ownership to another person first.", { type: "warning" });
        }
        else {
          toast("User has left the workspace", { type: "success" });
          if (id == localStorage.getItem("currWorkspaceID")) {
            localStorage.setItem("currWorkspaceID", "");
          }
          this.props.getInfo();
        }
      }).catch(error => {
        // toast(error.message, { type: "error" });
        // this.props.getInfo();
        console.log(error.message);
      });
    this.closeAll();
  }
  handleDelete(id) {
    sessionStorage.setItem("shoppingList", "");
    sessionStorage.setItem("idList", "");
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
      if (res.data.error === "There was an error deleting the workspace: Insufficient permissions") {
        toast("The workspace was not deleted. Only the owner may delete the workspace", { type: "error" });
      }
      else {
        toast("The workspace has been successfully deleted", { type: "success" });
        if (id == localStorage.getItem("currWorkspaceID")) {
          localStorage.setItem("currWorkspaceID", "");
        }
        this.props.getInfo();
        console.log(error.message);
      }
    }).catch(error => {
      // toast(error.message, { type: "error" });
      // this.props.getInfo();
      console.log(error.message);
    });
    this.closeAll();
  }
  checkDelete(id) {
    if (this.props.names.length == 1 && this.props.names[0][0] != "") {
      console.log("This is your last workspace.");
      this.closeAll();
      this.setState({ field: 0, open4: true });
    } else {
      this.handleDelete(id);
    }
  }
  checkLeave(id) {
    if (this.props.names.length == 1 && this.props.names[0][0] != "") {
      console.log("This is your last workspace.");
      this.closeAll();
      this.setState({ field: 1, open4: true });
    } else {
      this.handleLeave(id);
    }
  }
  makeList(items) {
    return <List selection verticalAlign='middle' style={{"margin-right": 10}}>{items.sort((a, b) => this.sortFunc(a, b)).map((item, i) => this.listItem(item))}</List>;
  }
  sortFunc(a, b){
    var x = a[0].toLowerCase();
    var y = b[0].toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
  }
  closeAll = () => {
    this.setState({
      open1: false,
      open2: false,
      open3: false,
      open4: false,
    });
  };
  open1 = () => {
    this.setState({ open1: true });
  };
  open2 = () => {
    this.setState({ open2: true });
  };
  open3 = () => {
    this.setState({ open3: true });
  };
  open4 = () => {
    this.setState({ open4: true });
  };

  setCurrentWorkspace(id) {
    sessionStorage.setItem("shoppingList", "");
    sessionStorage.setItem("idList", "");
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
      name = value[0]+" (current workspace)";
    }
    return (
      <List.Item
        active={isCurr}
        onClick={() => this.setCurrentWorkspace(value[1])}
        >
            <List.Header style={{"margin-top": 10, "margin-bottom": 10}}>{name}</List.Header>
        <Grid columns = {2}>
            <Grid.Column>
              <Button size="small" onClick={e => {this.refreshModal(value); this.open1(value[1]);e.stopPropagation()}}>
                Leave Workspace
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button size="small" onClick={e => {this.refreshModal(value); this.open2(value[1]);e.stopPropagation()}}>
                Delete Workspace
              </Button>
            </Grid.Column>
        </Grid>
      </List.Item>
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
        <Modal
          style={{ height: 200 }}
          open={this.state.open1}
          onOpen={() => this.open1()}
          onClose={() => this.closeAll()}
          size="small"
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
            <Button onClick={() => this.closeAll()}>
              Do not leave Workspace
            </Button>
          </div>
        </Modal>
        <Modal
          style={{ height: 200 }}
          open={this.state.open2}
          onOpen={() => this.open2()}
          onClose={() => this.closeAll()}
          size="small"
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
            <Button onClick={() => this.closeAll()}>
              Do not delete Workspace
            </Button>
          </div>
        </Modal>
        <Modal
          style={{ height: 200 }}
          open={this.state.open3}
          onOpen={() => this.open3()}
          onClose={() => this.closeAll()}
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
            <Button onClick={() => this.closeAll()}>
              Do not delete Workspace
            </Button>
          </div>
        </Modal>
        <Modal
          style={{ height: 200 }}
          open={this.state.open4}
          onOpen={() => this.open4()}
          onClose={() => this.closeAll()}
          size="tiny"
        >
          <Modal.Header>{this.state.field ? "Leave" : "Delete"} last Workspace?</Modal.Header>
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
            <Button onClick={() => this.closeAll()}>
              Do not {this.state.field ? "leave" : "delete"} Workspace
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}
