var mongoose = require('mongoose'); // mongoDB integration
var hash = require('./pass').hash; // password encryption module

module.exports = function(app) {

  // auth helpers start
  function authenticate(name, pass, fn) {
    UserModel.findOne({username: name}, function (err, user) {
      if (user) {
        if (err) return fn(new Error('cannot find user'));
        hash(pass, user.salt, function (err, hash) {
          if (err) return fn(err);
          if (hash == user.hash) return fn(null, user);
          fn(new Error('invalid password'));
        });
      } else {
        return fn(new Error('cannot find user'));
      }
    });
  }

  function userExist(req, res, next) {
    UserModel.count({
      username: req.body.username
    }, function (err, count) {
      if (count === 0) {
        next();
      } else {
        req.session.error = 'User already exists';
        res.redirect('/');
      }
    });
  }
  // auth helpers end

  // connect to database
  mongoose.connect( 'mongodb://localhost/contactr' );

  // mongoose schemas
  var Contact = new mongoose.Schema({
      username: String,
      name: String,
      tel: String,
      email: String,
      photo: String
  });

  var User = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
    hash: String
  });

  // mongoose models
  var ContactModel = mongoose.model('Contact', Contact);
  var UserModel = mongoose.model('User', User);

  // main route
  app.get('/', function(request, response) {
    if (request.session.user) {
      response.render('index.html', {'username': request.session.user.username}); // render app page with 'username' variable for ejs template
    } else {
      response.render('login.html');
    }
  });

  // auth routes start
  // auth form signup route
  app.post('/signup', userExist, function (req, res) {
    var password = req.body.password;
    var username = req.body.username;

    // check if username is empty string
    if (req.body.username.length === 0) {
      req.session.error = 'Please enter your name';
      res.redirect('/');
      return false;
    }

    // encrypt password and log in as new user
    hash(password, function (err, salt, hash) {
      if (err) throw err;
      var user = new UserModel({
        username: username,
        salt: salt,
        hash: hash,
      }).save(function (err, newUser) {
        if (err) throw err;
        authenticate(newUser.username, password, function(err, user){
          if(user){
            req.session.regenerate(function(){
              req.session.user = user;
              req.session.success = 'Authenticated as ' + user.username;
              res.redirect('/');
            });
          }
        });
      });
    });
  });

  // auth login form route
  app.post('/login', function (req, res) {
    authenticate(req.body.username, req.body.password, function (err, user) {
      if (user) {
        req.session.regenerate(function () {
          req.session.user = user;
          req.session.success = 'Logged as ' + user.username;
          res.redirect('/');
        });
      } else {
        req.session.error = 'Wrong login or password';
        res.redirect('/');
      }
    });
  });

  // auth logout route
  app.get('/logout', function (req, res) {
    req.session.destroy(function () {
      res.redirect('/');
    });
  });
  // auth routes end

  // get list of all contacts
  app.get( '/api/contacts', function( request, response ) {
    var loggedUser = { username: request.session.user.username }; // query db with logged username only
    return ContactModel.find(loggedUser, function( err, contacts ) {
      if( !err ) {
        return response.send( contacts );
      } else {
        return console.log( err );
      }
    });
  });

  // get single contact by id
  app.get( '/api/contacts/:id', function( request, response ) {
    return ContactModel.findById( request.params.id, function( err, contact ) {
      if( !err ) {
        return response.send( contact );
      } else {
        return console.log( err );
      }
    });
  });

  // insert new contact
  app.post( '/api/contacts', function( request, response ) {

    var contact = new ContactModel({
      username: request.session.user.username, // add logged username to contact info in in db
      name: request.body.name,
      tel: request.body.tel,
      email: request.body.email,
      photo: request.body.photo
    });

    contact.save( function( err ) {
      if( !err ) {
        return console.log( 'created' );
      } else {
        return console.log( err );
      }
    });
    return response.send( contact );
  });

  // update contact
  // not implemented on client-side yet
  app.put( '/api/contacts/:id', function( request, response ) {
    console.log( 'Updating contact ' + request.body.name);
    return ContactModel.findById( request.params.id, function( err, contact ) {
      contact.name = request.body.name;
      contact.tel = request.body.tel;
      contact.email = request.body.email;

      return contact.save( function( err ) {
        if( !err ) {
          console.log( 'contact updated' );
        } else {
          console.log( err );
        }
        return response.send( contact );
      });
    });
  });

  // delete contact
  app.delete( '/api/contacts/:id', function( request, response ) {
    console.log( 'Deleting contact with id: ' + request.params.id );
    return ContactModel.findById( request.params.id, function( err, contact ) {
      return contact.remove( function( err ) {
        if( !err ) {
          console.log( 'Contact removed' );
          return response.send( '' );
        } else {
          console.log( err );
        }
      });
    });
  });
};