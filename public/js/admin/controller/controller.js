define([], function() {

    // Main page controller
    var Controller = Backbone.Marionette.Controller.extend({

        // Initializer of main page controller
        initialize: function(options) {
            // hold application ref
            this.app = options.app;
        },

        showHomeView: function() {
            // show main page
            this.app.pageContent.show(this.app.homeView);
        },

        showAdministratorView: function() {
            this.app.pageContent.show(this.app.administratorView);
        }
    });

    return Controller;
});