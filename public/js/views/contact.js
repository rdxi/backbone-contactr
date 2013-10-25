console.log('views/contact.js start');

var app = app || {};

app.ContactView = Backbone.View.extend({
  tagName: 'div',
  className: 'contact-item',
  template: _.template( $('#contactTemplate').html() ),
  render: function() {
     // this.el is what we defined in tagName. use $el to get access to jQuery html() function
     this.$el.html( this.template(this.model.toJSON()) );
     return this;
  },

  events: {
    'click .delete': 'deleteContact'
  },

  deleteContact: function() {
    this.$el.fadeOut(300, function() { // fadeout view
      this.remove(); // delete view
    });
    this.model.destroy(); // delete model
  }
});