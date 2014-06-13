define([], function() {

    var Router = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            "home": "showHomeView",
            "search/:term": "showSearchView",
            "profile": "showProfileView",
            "profile/:id": "showProfileView",
            "post": "showPostView",
            "post/:id": "showPostView",
            "friend": "showFriendView",
            "group": "showGroupView",
            "group/:id": "showGroupView",
            "people": "showPeopleView",
            "bookmark": "showBookmarkView",
            "calendar": "showCalendarView",
            "notification": "showNotificationView",
            "activity": "showActivityView",
            "mailbox": "showMailBoxView",
        }
    });

    return Router;
});