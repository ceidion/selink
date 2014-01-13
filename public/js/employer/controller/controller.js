define([
    'model/profile',
    'model/events',
    'view/common/topnav',
    'view/common/sidenav',
    'view/resume/resume',
    'view/case/index',
    'view/case/create',
    'view/timecard/timecard',
], function(
    ProfileModel,
    EventsModel,
    TopNavView,
    SideNavView,
    ResumeView,
    CaseIndexView,
    CaseCreateView,
    TimeCardView
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
                id: $('#info-base').data('id'),
                profile: $('#info-base').data('profile')
            };

            this.showNavigation();
        },

        showNavigation: function() {

            // setup side nav
            this.app.sideNavView = new SideNavView();
            this.app.sidenavArea.show(this.app.sideNavView);

            // create profile model
            this.profileModel = new ProfileModel({
                _id: this.user.profile
            });

            var self = this;

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

        showCaseIndexView: function() {
            this.app.caseIndexView = new CaseIndexView();
            this.app.pageContent.show(this.app.caseIndexView);
        },

        showCaseCreateView: function() {
            this.app.caseCreateView = new CaseCreateView();
            this.app.pageContent.show(this.app.caseCreateView);
        },

        // show time card
        showTimeCardView: function() {

            var self = this;

            // create events model
            this.eventsModel = new EventsModel();
            this.eventsModel.userId = this.user.id;

            this.eventsModel.fetch({
                success: function() {

                    self.app.timeCardView = new TimeCardView({
                        collection: self.eventsModel
                    });

                    self.app.pageContent.show(self.app.timeCardView);
                }
            });
        }

    });

    return Controller;
});