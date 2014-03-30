define([
    'common/view/topnav/topnav',
    'common/view/shortcuts/shortcuts',
    'engineer/view/common/sidenav',
    'engineer/view/home/main',
    'common/view/profile/main',
    'common/view/post/main',
    'common/view/friend/main',
    'common/view/people/main',
    'common/view/people/detail',
    'common/view/calendar/main',
    'common/view/activity/main',
    // 'common/view/timecard/timecard',
    'common/view/mailbox/mailbox',
    'common/model/user'
], function(
    TopNavView,
    ShortCutsView,
    SideNavView,
    HomeView,
    ProfileView,
    PostView,
    FriendView,
    PeopleView,
    PeopleDetailView,
    CalendarView,
    ActivityView,
    // TimecardView,
    MailBoxView,
    UserModel
) {

    // Main page controller
    return Backbone.Marionette.Controller.extend({

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
                model: selink.userModel
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
        showProfileView: function(id) {

            if (!id || id === selink.userModel.get('_id')) {

                // create profile view
                selink.profileView = new ProfileView({
                    model: selink.userModel
                });
                // show profile view
                selink.pageContent.show(selink.profileView);

            } else {

                var people = new UserModel({
                    _id: id
                });
                people.fetch({
                    success: function() {
                        selink.peopleDetailView = new PeopleDetailView({
                            model: people
                        });
                        selink.pageContent.show(selink.peopleDetailView);
                    }
                });
            }
        },

        // show posts
        showPostView: function() {

            // create post view
            selink.postView = new PostView({
                model: selink.userModel
            });
            // show post view
            selink.pageContent.show(selink.postView);
        },

        // show friends
        showFriendView: function() {

            // create friend view
            selink.friendView = new FriendView();
            // show friend view
            selink.pageContent.show(selink.friendView);
        },

        // show people
        showPeopleView: function() {
            // create people view
            selink.peopleView = new PeopleView();
            // show people view
            selink.pageContent.show(selink.peopleView);
        },

        // show calendar
        showCalendarView: function() {

            // create calendar view
            selink.calendarView = new CalendarView({
                model: selink.userModel
            });
            // show calendar view
            selink.pageContent.show(selink.calendarView);
        },

        // show activity
        showActivityView: function() {

            // create activity view
            selink.activityView = new ActivityView({
                model: selink.userModel
            });
            // show activity view
            selink.pageContent.show(selink.activityView);
        },

        // // show timecard
        // showTimecardView: function(date) {

        //     var month = date ? moment(date, 'YYYYMM') : moment();

        //     // create timecard view
        //     selink.timecardView = new TimecardView({
        //         model: new Backbone.Model({month: month}),
        //         collection: selink.eventsModel
        //     });
        //     // show timecard view
        //     selink.pageContent.show(selink.timecardView);
        // },

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
});