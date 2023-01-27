// NOTE : Parens means we're invoking the imported module's fn.
const routes = require('next-routes')();


// NOTE: This matches IN ORDER, so above shadows below.
routes
	.add('Home', '/', '/')
	.add('List', '/list/:network', '/list')
	.add('Square Creation Dialog', '/squares/:network/new', '/new')
	.add('Individual Square', '/squares/:network/:address', '/show')
	.add('Individual Square Manager', '/squares/:network/:address/manage', '/manage');

// NOTE: this is an OBJECT that generates helpers we use everywhere.
module.exports = routes;
