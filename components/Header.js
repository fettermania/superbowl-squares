import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

// NOTE: Link tag injects the route in children
const Header = (props) => {

	// NOTE This is gross but good enough for now
	var mainnetClass = ((props.network == 'mainnet') ? "active item" : "item");
	var goerliClass = ((props.network == 'goerli') ? "active item" : "item");
  return (
    <Menu style={{ marginTop: '10px' }}>
    	<div className="item">
    		<a className="item" href="/">Home (Rules)</a>
		 </div>
    	<div className="item">
    		<a className={goerliClass} href="/list/goerli">Superbowl Squares (Goerli)</a>
		 </div>

    	<div className="item">
    		<a className={mainnetClass} href="/list/mainnet">Superbowl Squares (Mainnet)</a>
		 </div>
          
       <Menu.Menu position='right'>
          <a className="item">fettermania@gmail.com</a>
        </Menu.Menu>
      </Menu>);
};

export default Header; 