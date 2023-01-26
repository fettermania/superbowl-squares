import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

// NOTE: Link tag injects the route in children
// TODO 1/25 - Put two links, highlughted
// TODO 1/25 - inject URL network prop into Header
const Header = (props) => {
  return (
    <Menu style={{ marginTop: '10px' }}>
    	<Link route={`/`}>
    		<a className="item">Superbowl Squares</a>
		 </Link>
          
       <Menu.Menu position='right'>
          <a className="item">fettermania@gmail.com</a>
        </Menu.Menu>
      </Menu>);
};

export default Header; 