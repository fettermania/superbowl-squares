import React from 'react';
import { Container } from 'semantic-ui-react';

// NOTE: This Head component moves contents to HTML head
import Head from 'next/head';
import Header from './Header';

// Note: Campaign List (or other pages) should be a child of this.

// NOTE: Different than lecture.  Need named variable to export for React v17+ linter.
 const Layout = (props) => {
 	return (
 		<Container fluid>
 		    <Head>
   			  <link async
	    	    rel="stylesheet"
  		        href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
  			  />
  			 </Head>


 		   <Header network={props.network}/>
 		   {props.children}
 		</Container>
 		);
 };

 export default Layout;