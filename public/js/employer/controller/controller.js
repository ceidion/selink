define([
    'common/view/topnav/topnav',
    'common/view/shortcuts/shortcuts',
    'employer/view/common/sidenav',
    'employer/view/home/page',
    'common/view/profile/main',
    'common/view/post/main',
    'employer/view/job/main',
    'employer/view/job/edit',
    'common/view/friend/main',
    'common/view/people/main',
    'common/view/people/detail',
    'common/view/calendar/main',
    'common/view/mailbox/mailbox',
    'common/model/user'
], function(
    TopNavView,
    ShortCutsView,
    SideNavView,
    HomeView,
    ProfileView,
    PostView,
    JobIndexView,
    JobEditView,
    FriendView,
    PeopleView,
    PeopleDetailView,
    CalendarView,
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

        showJobIndexView: function() {
            selink.jobIndexView = new JobIndexView({
                model: selink.userModel
            });
            selink.pageContent.show(selink.jobIndexView);
        },

        showJobCreateView: function() {
            selink.jobEditView = new JobEditView();
            selink.pageContent.show(selink.jobEditView);
        },

        showJobEditView: function(id) {
            selink.jobEditView = new JobEditView({
                model: selink.jobsModel.get(id),
                collection: selink.jobsModel
            });
            selink.pageContent.show(selink.jobEditView);
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