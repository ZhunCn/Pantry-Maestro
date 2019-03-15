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
  constructor() {
    super();
    this.state = {
      works: ['Workspace1']
    };
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
    const stuff = ["Workspace 1", "Workspace 2"];
    return (
      <div class="workspacePage">
        <GenericNavigationBar/>
        <div class="Content">
        <h2>Workspaces</h2>
        	<div class="Total">
        	<div class="Left">
        		<strong>Workspaces you are enrolled in</strong>
        		<List items={stuff} />
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
