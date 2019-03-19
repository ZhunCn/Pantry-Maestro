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
          workspaces: this.props.names,
          user_id: this.props.user_id,
          open1: false,
          open2: false
      };
  }
  handleLeave(id){
    console.log("LEAVE ID: "+ id);
    let userLoginToken = localStorage.getItem("loginToken");
    axios.post('/api/account/leave',
    {
      "workspace_id": `${id}`
    },
    { headers: { "Authorization": `${userLoginToken}`}
    }).then(()=>{
      toast("User has left the workspace", { type: "success" });
      this.props.getInfo();
    }).catch(error => {
      console.log(error.message);
      this.close1();
      toast(error.message, { type: "error" });
      this.props.getInfo();
    });
    this.close1();
  }
  handleDelete(id){
    console.log("DELETE ID: "+ id);
    let userLoginToken = localStorage.getItem("loginToken");
    axios.post('/api/account/leave',
    {
      "workspace_id": `${id}`
    },
    { headers: { "Authorization": `${userLoginToken}`}
    }).catch(error => {
      console.log(error.message);
      toast(error.message, { type: "error" });
    });
    axios.delete(`/api/workspaces/${id}`,
    { headers: { "Authorization": `${userLoginToken}`}
    }).then(()=>{
      toast("The workspace has been successfully deleted", { type: "success" });
      this.props.getInfo();
    }).catch(error => {
      toast(error.message, { type: "error" });
      console.log(error.message);
    });
    this.close2();
  }
  makeList(items){
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
  listItem(value){
    return (<li>
    {value[0]} <br/>
    <Modal style = {{margin:20}}
        open={this.state.open1}
        onOpen={this.open1}
        onClose={this.close1}
        size="small"
        trigger={<Button>Leave Workspace</Button>}>
        <Modal.Header>Leave Workspace?</Modal.Header>
        <div class="contain" style = {{margin:20}}>
        <strong>Are you sure you want to leave {value[0]}?</strong><br/>
        <Button onClick={() => this.handleLeave(value[1])}>Leave Workspace</Button>
        <Button onClick={this.close1}>Do not leave Workspace</Button>
        </div>
    </Modal>
    <Modal style = {{margin:20}}
        open={this.state.open2}
        onOpen={this.open2}
        onClose={this.close2}
        size="small"
        trigger={<Button>Delete Workspace</Button>}>
        <Modal.Header>Delete Workspace?</Modal.Header>
        <div class="contain" style = {{margin:20}}>
        <strong>Are you sure you want to delete {value[0]}?</strong><br/>
        <Button onClick={() => this.handleDelete(value[1])}>Delete Workspace</Button>
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
