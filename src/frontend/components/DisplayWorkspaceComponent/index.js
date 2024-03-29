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
  handleLeave(id) {
    //refresh shopping cart
    sessionStorage.setItem("shoppingList", "");
    sessionStorage.setItem("idList", "");
    sessionStorage.setItem("expList", "");
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
      });
    this.closeAll();
  }
  handleDelete(id) {
    //refresh shopping cart
    sessionStorage.setItem("shoppingList", "");
    sessionStorage.setItem("idList", "");
    sessionStorage.setItem("expList", "");
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
      }
    }).catch(error => {
      // toast(error.message, { type: "error" });
      // this.props.getInfo();
    });
    this.closeAll();
  }
  checkDelete(id) {
    if (this.props.names.length == 1 && this.props.names[0][0] != "") {
      this.closeAll();
      this.setState({ field: 0, open4: true });
    } else {
      this.handleDelete(id);
    }
  }
  checkLeave(id) {
    if (this.props.names.length == 1 && this.props.names[0][0] != "") {
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
    //refresh shopping cart
    sessionStorage.setItem("shoppingList", "");
    sessionStorage.setItem("idList", "");
    sessionStorage.setItem("expList", "");
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
              <Button size="small" onClick={e => {this.refreshModal(value); this.open1(); e.stopPropagation()}}>
                Leave Workspace
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button size="small" onClick={e => {this.refreshModal(value); this.open2(); e.stopPropagation()}}>
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
        <h3>Workspaces you are enrolled in</h3>
        {(this.props.names.length==1 && !this.props.names[0][0]) ? (
          <List><List.Item><List.Header>No Workspaces</List.Header>Try creating one</List.Item></List>
        ) : (
          this.makeList(this.props.names)
        )}
        <Modal
          open={this.state.open1}
          onOpen={() => this.open1()}
          onClose={() => this.closeAll()}
          size="small"
        >
          <Modal.Header>Leave Workspace?</Modal.Header>
          <div class="contain" style={{ margin: 20 }}>
            <div class="text" style={{ "margin-bottom": 20 }}>
            <strong style={{ "margin-bottom": 20 }}>
              Are you sure you want to leave {this.state.works[0]}?
            </strong>
            <br />
            </div>
            <Button onClick={() => this.handleLeave(this.state.works[1])}>
              Leave Workspace
            </Button>
            <Button onClick={() => this.closeAll()}>
              Do not leave Workspace
            </Button>
          </div>
        </Modal>
        <Modal
          open={this.state.open2}
          onOpen={() => this.open2()}
          onClose={() => this.closeAll()}
          size="small"
        >
          <Modal.Header>Delete Workspace?</Modal.Header>
          <div class="contain" style={{ margin: 20 }}>
            <div class="text" style={{ "margin-bottom": 20 }}>
            <strong style={{ "margin-bottom": 20 }}>
              Are you sure you want to delete {this.state.works[0]}?
            </strong>
            <br />
            </div>
            <Button onClick={() => this.checkDelete(this.state.works[1])}>
              Delete Workspace
            </Button>
            <Button onClick={() => this.closeAll()}>
              Do not delete Workspace
            </Button>
          </div>
        </Modal>
        <Modal
          open={this.state.open3}
          onOpen={() => this.open3()}
          onClose={() => this.closeAll()}
          size="tiny"
        >
          <Modal.Header>Leave Workspace?</Modal.Header>
          <div class="contain" style={{ margin: 20 }}>
            <div class="text" style={{ "margin-bottom": 20 }}>
            <strong>
              You are the only user in the workspace.
              <br />
              If you leave, this workspace will be deleted.
              <br />
              Are you sure you want to leave {this.state.works[0]}?
            </strong>
            <br />
            </div>
            <Button onClick={() => this.checkDelete(this.state.works[1])}>
              Delete Workspace
            </Button>
            <Button onClick={() => this.closeAll()}>
              Do not delete Workspace
            </Button>
          </div>
        </Modal>
        <Modal
          open={this.state.open4}
          onOpen={() => this.open4()}
          onClose={() => this.closeAll()}
          size="tiny"
        >
          <Modal.Header>{this.state.field ? "Leave" : "Delete"} last Workspace?</Modal.Header>
          <div class="contain" style={{ margin: 20 }}>
            <div class="text" style={{ "margin-bottom": 20 }}>
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
            </div>
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
