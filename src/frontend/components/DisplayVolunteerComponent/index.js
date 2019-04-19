import React from "react";
import "./styles.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Button, Modal, List, Grid } from "semantic-ui-react";

export default class DisplayVolunteerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: this.props.userID,
      open1: false,
      open2: false,
      open3: false,
      open4: false,
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
  // makeList(items) {
  //   return <List>{items.map((item, i) => this.listItem(item))}</List>;
  // }
  makeList(items) {
    return <List bulleted verticalAlign='middle' style={{"margin-left": 10}}>{items.sort((a, b) => this.sortFunc(a, b)).map((item, i) => this.listItem(item))}</List>;
  }
  sortFunc(a, b){
    var x = a.account.username.toLowerCase();
    var y = b.account.username.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
  }
  open1 = () => this.setState({ open1: true });
  close1 = () => this.setState({ open1: false });
  open2 = () => this.setState({ open2: true });
  close2 = () => this.setState({ open2: false });
  open3 = () => this.setState({ open3: true });
  close3 = () => this.setState({ open3: false });
  open4 = () => this.setState({ open4: true });
  close4 = () => this.setState({ open4: false });
  closeAll = () => this.setState({ open1: false, open2: false, open3: false, open4: false });
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
  handlePromote(id) {
    let workID = localStorage.getItem("currWorkspaceID");
    let userLoginToken = localStorage.getItem("loginToken");
    axios.put(`/api/workspaces/${workID}/users/${id}/promote`, {}, {
        headers: {
          Authorization: `${userLoginToken}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
    }).then(res => {
      if (!res.data.error) {
        toast(res.data.message, { type: "success" });
      } else {
        toast(res.data.error, { type: "error" });
      }

      this.props.getInfo();
    });

    this.closeAll();
  }
  handleDemote(id) {
    let workID = localStorage.getItem("currWorkspaceID");
    let userLoginToken = localStorage.getItem("loginToken");
    axios.put(`/api/workspaces/${workID}/users/${id}/demote`, {}, {
        headers: {
          Authorization: `${userLoginToken}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
    }).then(res => {
      if (!res.data.error) {
        toast(res.data.message, { type: "success" });
      } else {
        toast(res.data.error, { type: "error" });
      }

      this.props.getInfo();
    });

    this.closeAll();
  }
  refreshModal(name, id) {
    this.setState({ curVolun: name, curID: id });
  }
  listItem(value) {
    var name = value.account.username;
    let workspaceID = localStorage.getItem("currWorkspaceID");
    let isSelf = value.account._id == this.props.userID;
    let promoteButton;

    // Either show button to promote, to demote, or nothing
    if (value.roles.includes("member")) {
      promoteButton = (
        <Button size="small" onClick={e => {this.refreshModal(name, value.account._id); this.open2()}}>
          Promote to Admin
        </Button>
      );
    }
    else if (value.roles.includes("admin")) {
      promoteButton = (
        <Button size="small" onClick={e => {this.refreshModal(name, value.account._id); this.open4()}}>
          Demote to Member
        </Button>
      );
    }
    else {
      promoteButton = "";
    }

    if (this.props.isOwner && !isSelf) {
      return (
        <List.Item>
          {name}
          <br />
          <Grid columns = {1}>
            <Grid.Row>
                <Button size="small" onClick={e => {this.refreshModal(name, value.account._id); this.open1()}}>
                  Remove from Workspace
                </Button>
                {promoteButton}
                <Button size="small" onClick={e => {this.refreshModal(name, value.account._id); this.open3()}}>
                  Transfer Ownership
                </Button>
            </Grid.Row>
          </Grid>
        </List.Item>
      );
    } else {
      return <List.Item>{name}</List.Item>;
    }
  }

  render() {
    return (
      <div>
        <div style={{"margin-top": 20}}>
          <h3>Volunteers in current workspace</h3>
        </div>
        {this.props.volunteers[0] != "" || !this.props.volunteers ? (
          this.makeList(this.props.volunteers)
        ) : (
            <List><List.Item><List.Header>No Volunteers</List.Header>Try inviting some volunteers</List.Item></List>
          )}
          <Modal
            open={this.state.open1}
            onOpen={this.open1}
            onClose={this.closeAll}
            size="small"
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
            open={this.state.open2}
            onOpen={this.open2}
            onClose={this.closeAll}
            size="small"
          >
            <Modal.Header>Make admin of workspace?</Modal.Header>
            <div class="contain" style={{ margin: 20 }}>
              <strong>
                Are you sure you want to make <i>{this.state.curVolun}</i> an
                administrator of <i>{this.props.name}</i>?
              </strong>
              <br />
              <Button onClick={() => this.handlePromote(this.state.curID)}>
                Make admin
              </Button>
              <Button onClick={this.closeAll}>Do not make admin</Button>
            </div>
          </Modal>
          <Modal
            open={this.state.open3}
            onOpen={this.open3}
            onClose={this.closeAll}
            size="small"
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
          <Modal
            open={this.state.open4}
            onOpen={this.open4}
            onClose={this.closeAll}
            size="small"
          >
            <Modal.Header>Demote admin to member?</Modal.Header>
            <div class="contain" style={{ margin: 20 }}>
              <strong>
                Are you sure you want to demote <i>{this.state.curVolun}</i> to a member?
              </strong>
              <br />
              <Button onClick={() => this.handleDemote(this.state.curID)}>
                Demote to Member
              </Button>
              <Button onClick={this.closeAll}>Do not demote</Button>
            </div>
          </Modal>
      </div>
    );
  }
}
