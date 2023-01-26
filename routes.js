// NOTE : Parens means we're invoking the imported module's fn.
const routes = require('next-routes')();


// TODONEW: get rid of all routes?  Just index page?
// NOTE: This matches IN ORDER, so above shadows below.

// TODO in progress 1/23
routes
//    .add('Home', '/', '/')
	.add('Home', '/home', '/home')
	.add('Square Creation Dialog', '/squares/new', '/new')
	.add('Individual Square', '/squares/:address', '/show')
	.add('Individual Square Manager', '/squares/:address/manage', '/manage');
 //    .add('Home', '/:network/', '/')
	// .add('Square Creation Dialog', '/:network/squares/new', '/new')
	// .add('Individual Square', '/:network/squares/:address', '/show')
	// .add('Individual Square Manager', '/:network/squares/:address/manage', '/manage');

// NOTE: this is an OBJECT that generates helpers we use everywhere.
module.exports = routes;

// TODO See if routes can work.