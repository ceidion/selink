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

        showResumeView: function() {
            this.app.pageContent.show(this.app.resumeView);
        },

        showTimeCardView: function() {
            this.app.pageContent.show(this.app.timeCardView);
        }
    });

    return Controller;
});