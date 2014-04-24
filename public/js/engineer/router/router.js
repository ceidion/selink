define([], function() {

    var Router = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            "home": "showHomeView",
            "profile": "showProfileView",
            "profile/:id": "showProfileView",
            "post": "showPostView",
            "post/:id": "showPostView",
            "friend": "showFriendView",
            "people": "showPeopleView",
            "calendar": "showCalendarView",
            "notification": "showNotificationView",
            "activity": "showActivityView",
            // "timecard": "showTimecardView",
            // "timecard/:date": "showTimecardView",
            "mailbox": "showMailBoxView",
        }
    });

    return Router;
});