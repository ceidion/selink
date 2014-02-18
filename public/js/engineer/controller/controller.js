define([
    'common/view/topnav/topnav',
    'common/view/shortcuts/shortcuts',
    'engineer/view/common/sidenav',
    'engineer/view/home/page',
    'common/view/profile/profile',
    'common/view/post/post',
    'common/view/calendar/calendar',
    'common/view/timecard/timecard',
    'common/view/mailbox/mailbox',
], function(
    TopNavView,
    ShortCutsView,
    SideNavView,
    HomeView,
    ProfileView,
    PostView,
    CalendarView,
    TimecardView,
    MailBoxView
) {

    // Main page controller
    var Controller = Backbone.Marionette.Controller.extend({

        // Initializer of main page controller
        initialize: function(options) {

            var self = this;

            // setup navigation bar
            this.showNavigation();

            // at the first time the page was opened, move to home page
            if (window.location.hash === "") {
                window.location = '#home';
            }
        },

        showNavigation: function() {

            // setup short cuts
            selink.shortCutsView = new ShortCutsView();
            selink.shortcutArea.show(selink.shortCutsView);

            // setup side nav
            selink.sideNavView = new SideNavView();
            selink.sidenavArea.show(selink.sideNavView);

            // setup top nav
            selink.topNavView = new TopNavView({
                model: selink.userModel,
                collection: selink.eventsModel
            });
            selink.topnavArea.show(selink.topNavView);
        },

        showHomeView: function() {

            // create home view
            selink.homeView = new HomeView({
                model: selink.userModel
            });
            // show main page
            selink.pageContent.show(selink.homeView);
        },

        // show profile
        showProfileView: function() {

            selink.userModel.fetch({
                success: function() {
                    // create profile view
                    selink.profileView = new ProfileView({
                        model: selink.userModel
                    });
                    // show profile view
                    selink.pageContent.show(selink.profileView);
                }
            });
        },

        // show posts
        showPostView: function() {

            // create profile view
            selink.postView = new PostView({
                model: selink.userModel
            });
            // show profile view
            selink.pageContent.show(selink.postView);
        },

        // show calendar
        showCalendarView: function() {

            // create calendar view
            selink.calendarView = new CalendarView({
                collection: selink.eventsModel
            });
            // show calendar view
            selink.pageContent.show(selink.calendarView);
        },

        // show timecard
        showTimecardView: function(date) {

            var month = date ? moment(date, 'YYYYMM') : moment();

            // create timecard view
            selink.timecardView = new TimecardView({
                model: new Backbone.Model({month: month}),
                collection: selink.eventsModel
            });
            // show timecard view
            selink.pageContent.show(selink.timecardView);
        },

        // show mailbox
        showMailBoxView: function() {

            // create mailbox view
            selink.mailBoxView = new MailBoxView({
                model: selink.userModel
            });
            // show mailbox view
            selink.pageContent.show(selink.mailBoxView);
        }
    });

    return Controller;
});