import React from 'react';
import './styles.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Button, Modal } from 'semantic-ui-react';


export default class DisplayVolunteerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      open1: false,
      open2: false,
      open3: false,
      volunteers: [''],
      curWorkspace: "",
      isOwner: false
    };
  }
  getID(token){
    return axios.get("/api/account",
    { headers: {
      "Authorization": `${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      }
    }).then(res => {
        this.setState({
          userID: res.data._id
        });
        console.log("USER ID: "+this.state.userID);
    });
  }
  componentDidMount(){
    this.updateInfo();
  }
  updateInfo() {
    let userLoginToken = localStorage.getItem("loginToken");
    let curWorkID = localStorage.getItem("currWorkspaceID");
    let userID = this.state.userID;
    console.log("USER ID: "+userID);
    axios.get(`/api/workspaces/${curWorkID}`,
      {
        headers: {
          "Authorization": `${userLoginToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => {
        this.setState({
          curWorkspace: res.data.name
        });
      }).then(() => {
        this.getID(userLoginToken).then(() => {
          this.getVolunteers(curWorkID);
          this.checkOwner(curWorkID);
        });
      }).catch(error => {
        console.log(error);
      });
  }
  checkOwner(id){
    console.log("Check Ownership of:" + this.state.userID);
    let userLoginToken = localStorage.getItem("loginToken");
    let userID = this.state.userID;
    axios.get(`/api/workspaces/${id}/users/${userID}`,
      { headers: { "Authorization": `${userLoginToken}`,
      'Accept' : 'application/json',
      'Content-Type': 'application/json' }}).then(res=>{
        if(res.data.roles[0]=="owner"){
          console.log("Ownership check complete: true");
          this.setState({isOwner: true});
        }
        else{
          console.log("Ownership check complete: False");
          this.setState({isOwner: false});
        }
    });
  }
  getVolunteers(id) {
    console.log("ID" + id);
    let userLoginToken = localStorage.getItem("loginToken");
    axios.get(`api/workspaces/${id}/users`,
      {
        headers: {
          "Authorization": `${userLoginToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => {
        this.setState({
          volunteers: res.data.users
        });
      });
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
  open3 = () => this.setState({ open3: true })
  close3 = () => this.setState({ open3: false })
  closeAll = () => this.setState({open1: false, open2: false, open3: false});
  handleRemove(id) {
    console.log("Remove: " + id);
    let userLoginToken = localStorage.getItem("loginToken");
    let workID = localStorage.getItem("currWorkspaceID");
    axios.delete(`/api/workspaces/${workID}/users/${id}`,
      {
        headers: {
          "Authorization": `${userLoginToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if(res.data.message=="Successfully deleted user from workspace"){
          toast(res.data.message, {type:"success"});
        }
        else {
          toast(res.data.message, {type:"error"});
        }
        this.updateInfo();
      });
    this.closeAll();
  }
  handleTransfer(id){
    console.log("Transfer: "+id);
    console.log("This function hasn't been implemented yet");
    toast("Nothing happened because this wasn't implemented yet", { type: "warning" });
    this.closeAll();
  }
  handleMakeAdmin(id){
    console.log("Make admin: "+id);
    console.log("This function hasn't been implemented yet");
    toast("Nothing happened because this wasn't implemented yet", { type: "warning" });
    this.closeAll();
  }
  refreshModal(value) {
    this.setState({ state: this.state });
  }
  listItem(value) {
    var name = value.account.username;
    let workspaceID = localStorage.getItem("currWorkspaceID");
    if(this.state.isOwner){
    return (<li>
      {name}
      <br />
      <Modal
        style={{ height: 280 }}
        open={this.state.open1}
        onOpen={this.open1}
        onClose={this.closeAll}
        size="small"
        trigger={<Button size='small' onClick={() => this.refreshModal(value)}>Remove from Workspace</Button>}>
        <Modal.Header>Remove {name} from {this.state.curWorkspace}?</Modal.Header>
        <div class="contain" style={{ margin: 20 }}>
          <strong>Are you sure you want to remove <i>{name}</i> from <i>{this.state.curWorkspace}</i>?</strong><br />
          <Button onClick={() => this.handleRemove(value.account._id)}>Remove from workspace</Button>
          <Button onClick={this.closeAll}>Do not remove from Workspace</Button>
        </div>
      </Modal>
      <Modal
        style={{ height: 280 }}
        open={this.state.open2}
        onOpen={this.open2}
        onClose={this.closeAll}
        size="small"
        trigger={<Button size='small' onClick={() => this.refreshModal(value)}>Make Admin</Button>}>
        <Modal.Header>Make Admin?</Modal.Header>
        <div class="contain" style={{ margin: 20 }}>
          <strong>Are you sure you want to make <i>{name}</i> an administrator of <i>{this.state.curWorkspace}</i>?</strong><br />
          <Button onClick={() => this.handleMakeAdmin(value.account._id)}>Make admin</Button>
          <Button onClick={this.closeAll}>Do not make admin</Button>
        </div>
      </Modal>
      <Modal
        style={{ height: 280 }}
        open={this.state.open3}
        onOpen={this.open3}
        onClose={this.closeAll}
        size="small"
        trigger={<Button size='small' onClick={() => this.refreshModal(value)}>Transfer ownership</Button>}>
        <Modal.Header>Transfer Ownership?</Modal.Header>
        <div class="contain" style={{ margin: 20 }}>
          <strong>Are you sure you want to make <i>{name}</i> the owner of <i>{this.state.curWorkspace}</i>?</strong><br />
          <Button onClick={() => this.handleTransfer(value.account._id)}>Transfer Ownership</Button>
          <Button onClick={this.closeAll}>Do not transfer ownership</Button>
        </div>
      </Modal>
    </li>);
  }
  else{
    return (
      <li>
      {name}
      </li>);
  }
  }

  render() {
    return (
      <div>
        <ToastContainer autoClose={3000} />
        <strong>Volunteers in current workspace</strong>
        {this.state.volunteers[0] != '' ?
          this.makeList(this.state.volunteers)
          : <ul>None</ul>
        }
      </div>
    )
  }
}
