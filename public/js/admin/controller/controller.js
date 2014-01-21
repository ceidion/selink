define([
    'common/view/topnav/topnav',
    'admin/view/common/sidenav',
    'admin/view/home/page',
    'admin/view/data/skill/skills',
    'common/view/profile/profile',
    'common/view/calendar/calendar',
], function(
    TopNavView,
    SideNavView,
    HomeView,
    SkillsView,
    ProfileView,
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
            this.app.homeView = new HomeView();
            // show main page
            this.app.pageContent.show(this.app.homeView);
        },

        showSkillsView: function() {
            // create home view
            this.app.skillsView = new SkillsView();
            // show main page
            this.app.pageContent.show(this.app.skillsView);
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