// NOTE : Parens means we're invoking the imported module's fn.
const routes = require('next-routes')();


// TODONEW: get rid of all routes?  Just index page?
// NOTE: This matches IN ORDER, so above shadows below.

routes
	.add('Square Creation Dialog', '/squares/new', '/new')
	.add('Individual Square', '/squares/:address', '/show');

// NOTE: this is an OBJECT that generates helpers we use everywhere.
module.exports = routes;

// TODO See if routes can work.