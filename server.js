// module dependencies
var application_root = __dirname,
    express = require( 'express' ), // web framework
    path = require( 'path' ); // utilities for dealing with file paths
var api = require('./api'); // auth routes and api

var ejs = require('ejs'); // templating engine
    ejs.open = '{{'; // custom delimiters to prevent conflict with client-side templates
    ejs.close = '}}';

var app = express(); // create server

// server config start
app.use( express.bodyParser() ); // parses request body and populates request.body

// cookies and session middleware for authorization
app.use(express.cookieParser('Secret word')); // 'Secret word' is optional argument to enable signed cookie support
app.use(express.session());

app.use( express.methodOverride() ); // checks request.body for HTTP method overrides so we can use app.delete and app.put in our api

// pass message variable to all templates
// must be before router!
app.use(function (req, res, next) {
  var err = req.session.error,
      msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

app.use( app.router ); // perform route lookup based on url and HTTP method
app.use( express.static( path.join( application_root, 'public') ) ); // where to serve static content

// redirect if no matching routes
// must be after router and static content!
app.use(function(req, res, next) {
  res.redirect('/');
});

// set render engine to ejs
app.set('views', __dirname + '/public');
app.engine('html', ejs.renderFile);
// server config end

api(app); // routes and api init

// start server
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
app.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Express server is listening on port 3000');
});
