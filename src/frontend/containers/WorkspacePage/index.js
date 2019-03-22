import React from 'react';
import ReactDOM from 'react-dom';
import {Link, Redirect} from "react-router-dom";
import axios from 'axios';
import {authorize} from '@/utils';
import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';
import AddWorkspaceComponent from "../../components/AddWorkspaceComponent";
import DisplayWorkspaceComponent from "../../components/DisplayWorkspaceComponent";
import InviteVolunteerComponent from "../../components/InviteVolunteerComponent";

export default class Workspace extends React.Component {
  //works: 2D array of [workspaceID]
  //userID: the current user's ID
  //names: 2D array of [name, workspaceID]
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      works: [''],
      names: [['','']]
    };
  }

  getNames(){
    let ids = this.state.works;
    if(!ids){
      return;
    }
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
        }
      }).catch(error => {
        console.log(error);
      })
    }
  }
  checkHasCurr(){
    var workspaces = this.state.works;
    var curWorkID = localStorage.getItem("currWorkspaceID");
    var i;
    var hasCurr = false;
    if(!curWorkID&&workspaces[0]!=''){
      localStorage.setItem("currWorkspaceID", workspaces[0]);
      return;
    }
    else{
      var ind = workspaces.indexOf(curWorkID);
      if(ind==-1){
        localStorage.setItem("currWorkspaceID", workspaces[0]);
      }
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
      this.checkHasCurr();
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
        		<DisplayWorkspaceComponent getInfo={()=>{this.getInfo()}} names = {this.state.names} user_id = {this.state.userID}/>
        	</div>
        	<div class="Right">
        		<AddWorkspaceComponent getInfo={()=>{this.getInfo()}} />
        		<InviteVolunteerComponent />
        		</div>
        	</div>
        </div>
      </div>
    );
  }
};
