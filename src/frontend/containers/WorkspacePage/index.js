import React from 'react';
import ReactDOM from 'react-dom';
import {Link, Redirect} from "react-router-dom";

import {authorize} from '@/utils';

import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';

export default class Workspace extends React.Component {
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
        		<ul><strong>Workspaces you are enrolled in</strong>
        			<li>Workspace A<br /><button>Remove Workspace</button></li>
        			<li>Workspace B<br /><button>Remove Workspace</button></li>
        			<li>Workspace C<br /><button>Remove Workspace</button></li>
        		</ul>
        		<ul>List of pending invitations
        			<li>Workspace D<br /><button>Accept Invitation</button></li>
        			<li>Workspace E<br /><button>Accept Invitation</button></li>
        		</ul>
        		<button>Accept All</button>
        	</div>
        	<div class="Right">
        		<form>
        			<p><strong>Create a new Workspace:</strong></p>
        			Workspace Name:<br />
          			<input type="text" name="name" />
        		</form>
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
