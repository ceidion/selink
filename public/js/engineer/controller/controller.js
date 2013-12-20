define([
    'model/profile',
    'view/resume/resume'
], function(
    ProfileModel,
    ResumeView
) {

    // Main page controller
    var Controller = Backbone.Marionette.Controller.extend({

        // Initializer of main page controller
        initialize: function(options) {

            // hold application ref
            this.app = options.app;

            // get user info base
            this.user = {
                profile: $('#info-base').data('profile')
            };

            // create profile model
            this.profileModel = new ProfileModel({
                _id: this.user.profile
            });

            this.profileModel.fetch();

            // create resume view
            this.app.resumeView = new ResumeView({
                model: this.profileModel
            });
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