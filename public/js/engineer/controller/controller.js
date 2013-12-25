define([
    'model/profile',
    'view/common/topnav',
    'view/common/sidenav',
    'view/resume/resume'
], function(
    ProfileModel,
    TopNavView,
    SideNavView,
    ResumeView
) {

    // Main page controller
    var Controller = Backbone.Marionette.Controller.extend({

        // Initializer of main page controller
        initialize: function(options) {

            var self = this;

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

            // setup side nav
            this.app.sideNavView = new SideNavView();
            this.app.sidenavArea.show(this.app.sideNavView);

            // setup top nav
            this.profileModel.fetch({
                // if success
                success: function() {
                    self.app.topNavView = new TopNavView({
                        model: self.profileModel
                    });
                    self.app.topnavArea.show(self.app.topNavView);
                }
            });
        },

        showHomeView: function() {
            // show main page
            this.app.pageContent.show(this.app.homeView);
        },

        // show resume
        showResumeView: function() {

            var self = this;

            // first fetch the model data
            this.profileModel.fetch({
                // if success
                success: function() {
                    // create resume view
                    self.app.resumeView = new ResumeView({
                        model: self.profileModel
                    });
                    // show resume view
                    self.app.pageContent.show(self.app.resumeView);
                }
            });
        },

        showTimeCardView: function() {
            this.app.pageContent.show(this.app.timeCardView);
        }
    });

    return Controller;
});