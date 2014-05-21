define([
  'jquery',
  'underscore',
  'backbone',
  'models/contact'
  ], function($, _, Backbone, ContactModel) {

  console.log('collections/library.js start');

  var Library = Backbone.Collection.extend({
    model: ContactModel,
    url: '/api/contacts'
  });

  return Library;

});
