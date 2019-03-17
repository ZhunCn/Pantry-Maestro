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

const List = ({ items }) => (
  <ul>
    {
      items.map((item, i) => <ListItem key={i} value={item} />)
    }
  </ul>
);

export default class Workspace extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        works: [''],
        names: ['']
      };
    }
  getNames(){
    let ids = this.state.works;
    // let names1 = ids.slice(0);
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
        if(this.state.names[0] == ''){
          this.setState({
            names:[res.data.name]
          });
        }
        else{
          this.setState({
            names: [...this.state.names, res.data.name]
          });
        }
      }).catch(error => {
        console.log(error);
      })
    }
  }

  componentDidMount(){
    let userLoginToken = localStorage.getItem("loginToken");
    axios.get("/api/account", { headers: { "Authorization" : `${userLoginToken}` } }).then(res => {
        this.setState({
          works: res.data.workspaces
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
            {this.state.names[0] != '' ?
              <List items={this.state.names}/>
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
