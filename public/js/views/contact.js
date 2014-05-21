define([
  'jquery',
  'underscore',
  'backbone'
  ], function($, _, Backbone) {

    console.log('views/contact.js start');

    var ContactView = Backbone.View.extend({
      tagName: 'div',
      className: 'contact-item',
      template: _.template( $('#contactTemplate').html() ),
      render: function() {
        // this.el is what we defined in tagName. use $el to get access to jQuery html() function
        this.$el.html( this.template(this.model.toJSON()) );
        return this;
      },

      events: {
        'click .delete': 'deleteContact',
        'keyup input': 'editContact',
        'blur input': 'editContact'
      },

      deleteContact: function() {
        this.$el.fadeOut(300, function() { // fadeout view
          this.remove(); // delete view
        });
        this.model.destroy(); // delete model
      },

      editContact: function(e) {
        var keyEnter = 13,
            keyEscape = 27;

        var newValue = e.target.value,
            className = e.target.parentElement.className, // name || tel || email,
            oldValue = this.model.attributes[className];

        if (e.type === 'keyup' && e.keyCode === keyEnter) {
          e.target.blur();
        }

        if (e.type === 'keyup' && e.keyCode === keyEscape) {
          e.target.value = oldValue;
          e.target.blur();
        }

        if (e.type === 'focusout' && oldValue !== newValue) {
          this.model.set(className, newValue);
          this.model.save();
        }
      }
    });

    return ContactView;
});
