define([
    'common/view/topnav/topnav',
    'engineer/view/common/sidenav',
    'engineer/view/home/page',
    'common/view/profile/profile',
    'common/view/calendar/calendar',
    'common/view/timecard/timecard',
], function(
    TopNavView,
    SideNavView,
    HomeView,
    ProfileView,
    CalendarView,
    TimecardView
) {

    // Main page controller
    var Controller = Backbone.Marionette.Controller.extend({

        // Initializer of main page controller
        initialize: function(options) {

            var self = this;

            // hold application ref
            this.app = options.app;

            // setup navigation bar
            this.showNavigation();

            // at the first time the page was opened, move to home page
            if (window.location.hash === "") {
                window.location = '#home';
            }
        },

        showNavigation: function() {

            // setup side nav
            this.app.sideNavView = new SideNavView();
            this.app.sidenavArea.show(this.app.sideNavView);

            // setup top nav
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

        // show profile
        showProfileView: function() {

            // create profile view
            this.app.profileView = new ProfileView({
                model: this.app.profileModel
            });
            // show profile view
            this.app.pageContent.show(this.app.profileView);
        },

        // show calendar
        showCalendarView: function() {

            // create calendar view
            this.app.calendarView = new CalendarView({
                collection: this.app.eventsModel
            });
            // show calendar view
            this.app.pageContent.show(this.app.calendarView);
        },

        // show timecard
        showTimecardView: function() {

            // create timecard view
            this.app.timecardView = new TimecardView({
                collection: this.app.eventsModel
            });
            // show timecard view
            this.app.pageContent.show(this.app.timecardView);
        }

    });

    return Controller;
});