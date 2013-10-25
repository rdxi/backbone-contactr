console.log('collections/library.js start');

var app = app || {};

app.Library = Backbone.Collection.extend({
  model: app.Contact,
  url: '/api/contacts'
});