define([
    'common/view/topnav/topnav',
    'admin/view/common/sidenav',
    'admin/view/home/main',
    'common/view/profile/main',
    'common/view/post/main',
    'common/view/post/detail',
    'common/view/friend/main',
    'common/view/people/main',
    'common/view/people/detail',
    'common/view/calendar/main',
    'common/view/activity/main',
    'common/view/notification/main',
    'common/view/mailbox/main',
    'admin/view/data/skill/main',
    'admin/view/data/solr/main',
    'admin/view/announcement/main',
    'admin/view/issue/main',
    'common/model/user',
    'common/model/post'
], function(
    TopNavView,
    SideNavView,
    HomeView,
    ProfileView,
    PostView,
    PostDetailView,
    FriendView,
    PeopleView,
    PeopleDetailView,
    CalendarView,
    ActivityView,
    NotificationView,
    MailBoxView,
    SkillsView,
    SolrView,
    AnnouncementView,
    IssueView,
    UserModel,
    PostModel
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

            // setup side nav
            selink.sideNavView = new SideNavView();
            selink.sidenavArea.show(selink.sideNavView);

            // setup top nav
            selink.topNavView = new TopNavView();
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

                var people = new UserModel({_id: id});
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
        showPostView: function(id) {

            if (id) {

                var post = new PostModel({_id: id});
                post.fetch({
                    success: function() {

                        var postDetailView = new PostDetailView({
                            model: post,
                            modal: true
                        });

                        selink.modalArea.show(postDetailView);
                        selink.modalArea.$el.modal('show');
                    }
                });

            } else {

                // create post view
                selink.postView = new PostView();
                // show post view
                selink.pageContent.show(selink.postView);
            }
        },

        // show friends
        showFriendView: function() {

            // if the user don't have any friend
            if (!selink.userModel.friends.length) {

                // go to people view
                this.showPeopleView();

                return;
            }

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
            selink.calendarView = new CalendarView();
            // show calendar view
            selink.pageContent.show(selink.calendarView);
        },

        // show activity
        showActivityView: function() {

            // create activity view
            selink.activityView = new ActivityView();
            // show activity view
            selink.pageContent.show(selink.activityView);
        },

        // show notification
        showNotificationView: function() {

            // create notification view
            selink.notificationView = new NotificationView();
            // show notification view
            selink.pageContent.show(selink.notificationView);
        },

        // show mailbox
        showMailBoxView: function() {

            // create mailbox view
            selink.mailboxView = new MailBoxView();
            // show mailbox view
            selink.pageContent.show(selink.mailboxView);
        },

        showSkillsView: function() {

            // create tag view
            selink.skillsView = new SkillsView();
            // show main page
            selink.pageContent.show(selink.skillsView);
        },

        showSolrView: function() {

            // create solr view
            selink.solrView = new SolrView();
            // show main page
            selink.pageContent.show(selink.solrView);
        },

        showAnnouncementView: function() {

            // create announcement view
            selink.announcementView = new AnnouncementView();
            // show main page
            selink.pageContent.show(selink.announcementView);
        },

        showIssueView: function() {

            // create issue view
            selink.issueView = new IssueView();
            // show main page
            selink.pageContent.show(selink.issueView);
        },

    });
});