define(['underscore', 'backbone'], function(_, Backbone) {

    console.log('models/contact.js start');

    var Contact = Backbone.Model.extend({
      defaults: {
        name: 'John Doe',
        tel: '555222999',
        email: 'email@example.com',
        photo: 'img/photo.png'
      },

      // parse function lets you edit the server response before it is passed to the Model constructor
      // backbone expects id without '_' so we reassign it
      parse: function(response) {
        response.id = response._id;
        return response;
      }
    });

    return Contact;
});
