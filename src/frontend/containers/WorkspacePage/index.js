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
import DisplayVolunteerComponent from "../../components/DisplayVolunteerComponent";


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
      volunteers: [''],
      isOwner: false,
      curName: '',
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
      if(!id){
        continue;
      }
      axios.get(`/api/workspaces/${id}`,
      { headers: { "Authorization": `${userLoginToken}`,
        'Accept' : 'application/json',
        'Content-Type': 'application/json' }
      }).then(res => {
        if(res.data.error !== "There was an error getting your account information: Invalid workspace_id"){
          if(!(res.data.name===''||!res.data.name)){
            if(this.state.names[0][0] === ''){
              this.setState({
                names:[[res.data.name, id]]
              });
            }
            else{
              this.setState({
                names: [...this.state.names, [res.data.name, id]]
              });
            }
          }
        }
      }).catch(error => {
        console.log(error);
      })
    }
  }
  checkHasCurr(){
    var workspaces = this.state.works;
    if(workspaces.length==1&&workspaces[0]==null){
      localStorage.setItem("currWorkspaceID", "");
      return false;
    }
    var curWorkID = localStorage.getItem("currWorkspaceID");
    var i;
    var hasCurr = false;
    if(!curWorkID||curWorkID=="null"||curWorkID==''){
      if(workspaces[0]){
        localStorage.setItem("currWorkspaceID", workspaces[0]);
      }
      else if(workspaces[1]){
        localStorage.setItem("currWorkspaceID", workspaces[1]);
      }
    }
    else{
      var ind = workspaces.indexOf(curWorkID);
      if(ind==-1){
        if(workspaces[0]){
          localStorage.setItem("currWorkspaceID", workspaces[0]);
        }
        else if(workspaces[1]){
          localStorage.setItem("currWorkspaceID", workspaces[1]);
        }
      }
    }
    return true;
  }
  componentDidMount(){
    this.getInfo();
  }
  getVolunteers(id) {
    console.log("ID" + id);
    let userLoginToken = localStorage.getItem("loginToken");
    if(id=="null"){
      this.setState({
        volunteers: ['']
      });
      return;
    }
    axios.get(`api/workspaces/${id}/users`, {
        headers: {
          Authorization: `${userLoginToken}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
    }).then(res => {
      if(res.data.users){
        this.setState({
          volunteers: res.data.users
        });
      }
      else{
        this.setState({
          volunteers: ['']
        });
      }
      console.log("Volunteers");
      console.log(this.state.volunteers);
    }).catch(()=>{
      this.setState({
        volunteers: ['']
      });
    });
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
    }).then(()=>{
      if(this.checkHasCurr()){
        var curWork = localStorage.getItem("currWorkspaceID");
        this.getNames();
        this.getVolunteers(curWork);
        this.checkOwnership(curWork);
        this.getCurName(curWork);
      }
      else{
        this.setState({
          volunteers:[''],
        });
      }
    }).catch(err=>{
      this.setState({
        volunteers:[''],
      });
      console.log(err.message);
    });
  }
  getCurName(id){
    let userLoginToken = localStorage.getItem("loginToken");
    axios.get(`/api/workspaces/${id}`,
    { headers: { "Authorization": `${userLoginToken}`,
      'Accept' : 'application/json',
      'Content-Type': 'application/json' }
    }).then(res => {
      this.setState({
        curName: res.data.name
      });
    }).catch(error => {
      this.setState({
        curName: ''
      });
      console.log(error);
    });
  }
  checkOwnership(id){
    let userLoginToken = localStorage.getItem("loginToken");
    axios.get(`/api/workspaces/${id}/users/${this.state.userID}`, {
      headers: {
        Authorization: `${userLoginToken}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.data.roles.includes("owner")) {
        console.log("Ownership check complete: true");
        this.setState({ isOwner: true });
      } else {
        console.log("Ownership check complete: False");
        this.setState({ isOwner: false });
      }
    }).catch(res=>{
      this.setState({
        isOwner: false
      });
      console.log("Error");
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
            <DisplayVolunteerComponent getInfo={()=>{this.getInfo()}} isOwner = {this.state.isOwner} volunteers = {this.state.volunteers} userID = {this.state.userID} name = {this.state.curName}/>
        		</div>
        	</div>
        </div>
      </div>
    );
  }
};
