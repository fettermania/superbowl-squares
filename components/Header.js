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
    		<a className="item">Home (Rules)</a>
		 </Link>
    	<Link route={`/list/goerli`}>
    		<a className="item">Superbowl Squares (Goerli)</a>
		 </Link>

    	<Link route={`/list/mainnet`}>
    		<a className="item">Superbowl Squares (Mainnet)</a>
		 </Link>
          
       <Menu.Menu position='right'>
          <a className="item">fettermania@gmail.com</a>
        </Menu.Menu>
      </Menu>);
};

export default Header; 