require.config({
  paths: {
    jquery: 'libs/jquery-1.11.0.min',
    underscore: 'libs/underscore-min',
    backbone: 'libs/backbone-min',
    utils: 'libs/utils'
  }
});

require(['jquery', 'views/library'], function($, LibraryView){

    $(function() {
      console.log('app.js start');
      new LibraryView();
    });

});
