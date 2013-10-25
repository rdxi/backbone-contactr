console.log('views/library.js start');

var app = app || {};

app.LibraryView = Backbone.View.extend({
  el: '.contacts',

  initialize: function(initialContacts) {
    this.collection = new app.Library();
    this.collection.fetch({reset: true});

    this.render();
    this.listenTo(this.collection, 'add', this.renderContact);
    this.listenTo(this.collection, 'reset', this.render);
  },

  // render library by rendering each contact in its collection
  render: function() {
    this.collection.each(function(item) {
      this.renderContact(item);
    }, this);
    this.$el.removeClass('loading');
  },

  // render a contact by creating a contactView and appending the
  // element it renders to the library's element
  renderContact: function(item) {
    var contactView = new app.ContactView({
      model: item
    });

    $(contactView.render().el)
      .appendTo(this.$el.find('.contact-list'))
      .hide()
      .fadeIn(300);
  },

  events: {
    'click button.add': 'contactAdd',
    'drop .photo-drop': 'photoDrop',
    'dragover .photo-drop': 'photoDragover'
  },

  photoDrop: function (e) {
    var self = this;
    e.stopPropagation();
    e.preventDefault();

    e.originalEvent.dataTransfer.dropEffect = 'copy';
    var pictureFile = e.originalEvent.dataTransfer.files[0]; // get file from drop event

    if (!pictureFile.type.match('image.*')) {
      return false;
    }

    // read file
    var reader = new FileReader();
    reader.onloadend = function() {
      UTILS.Resample(this.result, 100, 100, photoResult); // resize and crop file
    };
    reader.readAsDataURL(pictureFile);

    function photoResult(data) {
      $('.photo-drop img').attr('src', data).show(); // append to preview div and show
      self.photoObj = data; // store to object from which model going to be updated
    }
   },

  photoDragover: function(e) {
    e.preventDefault();
  },

  contactAdd: function(e) {
    e.preventDefault();

    var formData = {};

    $('#addContact div').children('input').each(function(i, el) {
      // if not empty add input value to form data
      if ($(el).val() != '') {
        formData[el.id] = $(el).val();
      }
      $(el).val(''); // clear input field value
    });

    // if photo is available add it to form data
    if (this.photoObj) {
      formData.photo = this.photoObj;
      delete this.photoObj;
      $('.photo-drop img').attr('src', '#').hide(); // clear image preview div and hide
    }
    this.collection.create(formData);
  }
});