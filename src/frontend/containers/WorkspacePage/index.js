import React from 'react';
import ReactDOM from 'react-dom';
import {Link, Redirect} from "react-router-dom";
import axios from 'axios';
import {authorize} from '@/utils';

import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';
import AddWorkspaceComponent from "../../components/AddWorkspaceComponent";

const ListItem = ({ value }) => (
  <li>{value}</li>
);

// function getName(id){
//   let userLoginToken = localStorage.getItem("loginToken");
//   return axios.get(`/api/workspaces/${id}`,
//   { headers: { "Authorization": `${userLoginToken}`,
//     'Accept' : 'application/json',
//     'Content-Type': 'application/json' }
//   }).then(res => {
//     return res;
//   });
// }

const List = ({ items }) => (
  <ul>
    {
      items.map((item, i) => <ListItem key={i} value={item} />)
    }
  </ul>
);

export default class Workspace extends React.Component {
  // getNames(){
  //   let ids = this.state.works;
  //   let names1 = ids.slice(0);
  //   let length = ids.length;
  //   let userLoginToken = localStorage.getItem("loginToken");
  //   var i;
  //   for(i = 0; i<length; i++){
  //     let id = ids[i];
  //     axios.get(`/api/workspaces/${id}`,
  //     { headers: { "Authorization": `${userLoginToken}`,
  //       'Accept' : 'application/json',
  //       'Content-Type': 'application/json' }
  //     }).then(res => {
  //       this.res = res.data;
  //       return this.res.name;
  //     }).catch(error => {
  //       console.log(error);
  //     })
  //     console.log(this.state.name);
  //   }
  // }

  constructor() {
    super();
    this.state = {
      works: ['5c8c62f6c2028e560362eb04'],
      name: "",
      names: ['']
    };
  }
  beforeMount(){
    let userLoginToken = localStorage.getItem("loginToken");
    axios.get("/api/account", { headers: { "Authorization" : `${userLoginToken}` } }).then(res => {
        this.setState({
          works: res.data.workspaces
        });
        console.log(res.data);
    });
  }
  componentDidMount(){
    let userLoginToken = localStorage.getItem("loginToken");
    axios.get("/api/account", { headers: { "Authorization" : `${userLoginToken}` } }).then(res => {
        this.setState({
          works: res.data.workspaces
        });
        console.log(res.data);
    });
  }
  handleItemClick = (e) => {console.log(e.target.innerHTML)}

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
        		<List items={this.state.works} />
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
