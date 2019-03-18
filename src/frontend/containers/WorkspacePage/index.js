import React from 'react';
import ReactDOM from 'react-dom';
import {Link, Redirect} from "react-router-dom";
import axios from 'axios';
import {authorize} from '@/utils';

import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';
import AddWorkspaceComponent from "../../components/AddWorkspaceComponent";

export default class Workspace extends React.Component {
  //works: 2D array of [workspaceID]
  //userID: the current user's ID
  //names: 2D array of [name, workspaceID]
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      works: [''],
      names: [['','']],
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
      console.log("Successfully left workspace");
      this.getInfo();
    }).catch(error => {
      console.log(error.message);
      this.getInfo();
    });
  }
  handleDelete(id){
    console.log("DELETE ID: "+ id);
    this.handleLeave(id);
    let userLoginToken = localStorage.getItem("loginToken");
    axios.delete(`/api/workspaces/${id}`,
    { headers: { "Authorization": `${userLoginToken}`}
    }).then(()=>{
      console.log("Successfully deleted workspace");
      this.getInfo();
    }).catch(error => {
      console.log(error.message);
    });
  }
  makeList(items){
    return (<ul>
      {
        items.map((item, i) => this.listItem(item))
      }
    </ul>);
  }

  listItem(value){
    return (<li>
    {value[0]} <br/>
    <button onClick={() => this.handleLeave(value[1])}>Leave Workspace</button>
    <button onClick={() => this.handleDelete(value[1])}>Delete Workspace</button>
    </li>);
  }
  getNames(){
    let ids = this.state.works;
    let length = ids.length;
    let userLoginToken = localStorage.getItem("loginToken");
    var i;
    for(i = 0; i<length; i++){
      let id = ids[i];
      axios.get(`/api/workspaces/${id}`,
      { headers: { "Authorization": `${userLoginToken}`,
        'Accept' : 'application/json',
        'Content-Type': 'application/json' }
      }).then(res => {
        if(this.state.names[0][0] == ''){
          this.setState({
            names:[[res.data.name, id]]
          });
        }
        else{
          this.setState({
            names: [...this.state.names, [res.data.name, id]]
          });
          console.log(this.state.names);
        }
      }).catch(error => {
        console.log(error);
      })
    }
  }

  componentDidMount(){
    this.getInfo();
  }

  getInfo(){
    this.setState({
      works: [''],
      names: [['','']]
    });
    let userLoginToken = localStorage.getItem("loginToken");
    axios.get("/api/account", { headers: { "Authorization" : `${userLoginToken}` } }).then(res => {
        this.setState({
          works: res.data.workspaces,
          userID: res.data._id
        });
        console.log(res.data);
    }).then(()=>{
      this.getNames();
    }).then(()=>{
      console.log(this.state);
    });
  }

  render() {
    if (!authorize()) {
      return (
        <Redirect to="/login"/>
      );
    }
    return (
      <div class="workspacePage">
        <GenericNavigationBar/>
        <div class="Content">
        <h2>Workspaces</h2>
        	<div class="Total">
        	<div class="Left">
        		<strong>Workspaces you are enrolled in</strong>
            {this.state.names[0][0] != '' ?
              this.makeList(this.state.names)
              : <ul>None</ul>
            }
            <strong>List of pending invitations</strong>
        		<ul>
        			<li>Workspace D<br /><button>Accept Invitation</button></li>
        			<li>Workspace E<br /><button>Accept Invitation</button></li>
        		</ul>
        		<button>Accept All</button>
        	</div>
        	<div class="Right">
        		<AddWorkspaceComponent/>
        		<ul>List of your Workspaces
        			<li>Workspace A<br /><button>Remove Workspace</button></li>
        			<li>Workspace B<br /><button>Remove Workspace</button></li>
        		</ul>
        		<p><strong>Volunteers</strong></p>
        		<select>
        			  <option value="a">Workspace A</option>
          			<option value="b">Workspace B</option>
        		</select>
        		<ul>
        			<li>Bob Smith<br /><button>Make Admin</button><button>Remove Volunteer</button></li>
        			<li>John Bob<br /><button>Make Admin</button><button>Remove Volunteer</button></li>
        		</ul>
        		</div>
        	</div>
        </div>
      </div>
    );
  }
};
