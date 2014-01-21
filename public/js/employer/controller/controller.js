define([
    'common/model/job',
    'common/view/topnav/topnav',
    'employer/view/common/sidenav',
    'employer/view/home/page',
    'common/view/profile/profile',
    'employer/view/job/index',
    'employer/view/job/edit',
    'common/view/calendar/calendar',
], function(
    JobModel,
    TopNavView,
    SideNavView,
    HomeView,
    ProfileView,
    JobIndexView,
    JobEditView,
    CalendarView
) {

    // Main page controller
    var Controller = Backbone.Marionette.Controller.extend({

        // Initializer of main page controller
        initialize: function(options) {

            var self = this;

            // hold application ref
            this.app = options.app;

            this.showNavigation();
        },

        showNavigation: function() {

            // setup side nav
            this.app.sideNavView = new SideNavView();
            this.app.sidenavArea.show(this.app.sideNavView);

            this.app.topNavView = new TopNavView({
                model: this.app.profileModel,
                collection: this.app.eventsModel
            });
            this.app.topnavArea.show(this.app.topNavView);
        },

        showHomeView: function() {
            // create home view
            this.homeView = new HomeView();
            // show main page
            this.app.pageContent.show(this.app.homeView);
        },

        // show profile
        showProfileView: function() {

            // create profile view
            this.app.profileView = new ProfileView({
                model: this.app.profileModel
            });
            // show profile view
            this.app.pageContent.show(this.app.profileView);
        },

        showJobIndexView: function() {
            this.app.jobIndexView = new JobIndexView({
                collection: this.app.jobsModel
            });
            this.app.pageContent.show(this.app.jobIndexView);
        },

        showJobCreateView: function() {
            this.app.jobEditView = new JobEditView({
                model: new JobModel(),
                collection: this.app.jobsModel
            });
            this.app.pageContent.show(this.app.jobEditView);
        },

        showJobEditView: function(id) {
            this.app.jobEditView = new JobEditView({
                model: this.app.jobsModel.get(id),
                collection: this.app.jobsModel
            });
            this.app.pageContent.show(this.app.jobEditView);
        },

        // show time card
        showCalendarView: function() {

            this.app.timeCardView = new CalendarView({
                collection: this.app.eventsModel
            });

            this.app.pageContent.show(this.app.timeCardView);
        }

    });

    return Controller;
});