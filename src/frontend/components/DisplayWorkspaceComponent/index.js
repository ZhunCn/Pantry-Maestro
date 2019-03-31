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
          works: ['',''],
          noCurr: false,
          field: 0
      };
  }
  checkAndLeave(id){
    console.log("ID"+id);
    let userLoginToken = localStorage.getItem("loginToken");
    return axios.get(`api/workspaces/${id}/users`,
      { headers: { "Authorization": `${userLoginToken}`,
      'Accept' : 'application/json',
      'Content-Type': 'application/json' }}).then(res=>{
        if(res.data.users.length>1){
          this.checkLeave();
        }
        else{
          this.closeAll();
          this.open3();
        }
      });
  }
  handleLeave(id){
    console.log("LEAVE ID: "+ id);
    if(id ==localStorage.getItem("currWorkspaceID")){
      localStorage.setItem("currWorkspaceID", "");
    }
    let userLoginToken = localStorage.getItem("loginToken");
    axios.post('/api/account/leave',
    {
      "workspace_id": `${id}`
    },
    { headers: { "Authorization": `${userLoginToken}`,
    'Accept' : 'application/json',
    'Content-Type': 'application/json' }
  }).then(res=>{
      if(res.data.error=="You can't leave the workspace if you're the last member in it"){
        toast(res.data.error +". Try deleting the workspace instead.", {type:"warning"});
      }
      else{
        console.log(res.data);
        toast("User has left the workspace", { type: "success" });
        this.props.getInfo();
      }
    }).catch(error => {
      toast(error.message, { type: "error" });
      this.props.getInfo();
    });
    this.closeAll();
  }
  handleDelete(id){
    console.log("DELETE ID: "+ id);
    if(id ==localStorage.getItem("currWorkspaceID")){
      localStorage.setItem("currWorkspaceID", "");
    }
    let userLoginToken = localStorage.getItem("loginToken");
    axios.delete(`/api/workspaces/${id}`,
      { headers: { "Authorization": `${userLoginToken}`,
      'Accept' : 'application/json',
      'Content-Type': 'application/json' }
    }).then(()=>{
      toast("The workspace has been successfully deleted", { type: "success" });
      this.props.getInfo();
    }).catch(error => {
      toast(error.message, { type: "error" });
      console.log(error.message);
    });
    axios.post('/api/account/leave',
    {
      "workspace_id": `${id}`
    },
    { headers: { "Authorization": `${userLoginToken}`,
    'Accept' : 'application/json',
    'Content-Type': 'application/json' }
    }).catch(error => {
      console.log(error.message);
      toast(error.message, { type: "error" });
    });
    this.closeAll();
  }
  checkDelete(id){
    if(this.props.names.length==1&&this.props.names[0][0]!=''){
      console.log("This is your last workspace.");
      this.closeAll();
      this.setState({field:0, open4:true});
    }
    else{
      this.handleDelete(id);
    }
  }
  checkLeave(id){
    if(this.props.names.length==1&&this.props.names[0][0]!=''){
      console.log("This is your last workspace.");
      this.closeAll();
      this.setState({field:1, open4:true});
    }
    else{
      this.handleLeave(id);
    }
  }
  makeList(items){
    return (<ul>
      {
        items.map((item, i) => this.listItem(item))
      }
    </ul>);
  }
  closeAll = () => this.setState({open1: false, open2:false, open3:false, open4:false})
  open1 = () => this.setState({ open1: true })
  close1 = () => this.setState({ open1: false })
  open2 = () => this.setState({ open2: true })
  close2 = () => this.setState({ open2: false })
  open3 = () => this.setState({ open3: true })
  close3 = () => this.setState({ open3: false })
  open4 = () => this.setState({ open3: true })
  close4 = () => this.setState({ open3: false })
  setCurrentWorkspace(id){
    localStorage.setItem("currWorkspaceID", id);
    this.setState({state: this.state});
  }
  refreshModal(value){
    this.setState({works: value});
  }
  listItem(value){
    var name = value[0];
    let workspaceID = localStorage.getItem("currWorkspaceID");
    var isCurr = value[1]==workspaceID;
    if (isCurr){
      name = (<strong>{value[0]} (current workspace)</strong>);
    }
    return (<li>
    {name}
    {isCurr?
      null:
      <Button style={{marginLeft:5}}size='small' onClick={() => this.setCurrentWorkspace(value[1])}>setWorkspace</Button>
    }
    <br/>
    <Modal
        open={this.state.open1}
        onOpen={this.open1}
        onClose={this.closeAll}
        size="small"
        trigger={<Button size='small' onClick={()=>this.refreshModal(value)}>Leave Workspace</Button>}>
        <Modal.Header>Leave Workspace?</Modal.Header>
        <div class="contain" style = {{margin:20}}>
        <strong>Are you sure you want to leave {this.state.works[0]}?</strong><br/>
        <Button onClick={() => this.checkLeave(this.state.works[1])}>Leave Workspace</Button>
        <Button onClick={this.closeAll}>Do not leave Workspace</Button>
        </div>
    </Modal>
    <Modal
        open={this.state.open2}
        onOpen={this.open2}
        onClose={this.closeAll}
        size="small"
        trigger={<Button size='small' onClick={()=>this.refreshModal(value)}>Delete Workspace</Button>}>
        <Modal.Header>Delete Workspace?</Modal.Header>
        <div class="contain" style = {{margin:20}}>
        <strong>Are you sure you want to delete {this.state.works[0]}?</strong><br/>
        <Button onClick={() => this.checkDelete(this.state.works[1])}>Delete Workspace</Button>
        <Button onClick={this.closeAll}>Do not delete Workspace</Button>
        </div>
    </Modal>
    <Modal
        open={this.state.open3}
        onOpen={this.open3}
        onClose={this.closeAll}
        size="tiny">
        <Modal.Header>Leave Workspace?</Modal.Header>
        <div class="contain" style = {{margin:20}}>
        <strong>You are the only user in the workspace.<br/>
        If you leave, this workspace will be deleted.<br/>
        Are you sure you want to leave {this.state.works[0]}?</strong><br/>
        <Button onClick={() => this.checkDelete(this.state.works[1])}>Delete Workspace</Button>
        <Button onClick={this.closeAll}>Do not delete Workspace</Button>
        </div>
    </Modal>
    <Modal
        open={this.state.open4}
        onOpen={this.open4}
        onClose={this.closeAll}
        size="tiny">
        <Modal.Header>Leave last Workspace?</Modal.Header>
        <div class="contain" style = {{margin:20}}>
        <strong>This is your only workspace.<br/>
        If you {this.state.field ? "leave" : "delete"} this workspace, you will not have any workspaces left.<br/>
        Are you sure you want to {this.state.field ? "leave" : "delete"} {this.state.works[0]}?</strong><br/>
        <Button onClick={() => this.state.field ? this.handleLeave(this.state.works[1]): this.handleDelete(this.state.works[1])}>Delete Workspace</Button>
        <Button onClick={this.closeAll}>Do not delete Workspace</Button>
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
