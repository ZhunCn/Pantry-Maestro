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
      user_id: this.props.user_id,
      open1: false,
      volunteers: [''],
      curWorkspace: ""
    };
  }
  componentDidMount() {
    let userLoginToken = localStorage.getItem("loginToken");
    let curWorkID = localStorage.getItem("currWorkspaceID");
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
        this.getVolunteers(curWorkID);
      }).catch(error => {
        console.log(error);
      });
  }
  getVolunteers(id) {
    console.log("ID" + id);
    let userLoginToken = localStorage.getItem("loginToken");
    let userID = this.props.user_id;
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
  handleRemove(id) {
    console.log("Remove " + id);
    console.log("This function hasn't been implemented yet");
    toast("Nothing happened because this wasn't implemented yet", { type: "warning" });
    this.close1();
  }
  refreshModal(value) {
    this.setState({ state: this.state });
  }
  listItem(value) {
    var name = value.account.username;
    let workspaceID = localStorage.getItem("currWorkspaceID");
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
          <strong>Are you sure you want to remove {name} from {this.state.curWorkspace}?</strong><br />
          <Button onClick={() => this.handleRemove(value.account._id)}>Remove from workspace</Button>
          <Button onClick={this.close1}>Do not remove from Workspace</Button>
        </div>
      </Modal>
    </li>);
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
