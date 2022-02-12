// NOTE : Parens means we're invoking the imported module's fn.
const routes = require('next-routes')();


// TODONEW: get rid of all routes?  Just index page?
// NOTE: This matches IN ORDER, so above shadows below.

// routes
// 	.add('/campaigns/new', '/campaigns/new') // Overrides default
// 	.add('/campaigns/:address', '/campaigns/show')
// 	.add('/campaigns/:address/requests', '/campaigns/requests/index')
// 	.add('/campaigns/:address/requests/new', '/campaigns/requests/new');

// NOTE: this is an OBJECT that generates helpers we use everywhere.
module.exports = routes;