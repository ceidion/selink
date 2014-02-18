define([], function() {

    var Router = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            "home": "showHomeView",
            "profile": "showProfileView",
            "post": "showPostView",
            "friend": "showFriendView",
            "calendar": "showCalendarView",
            "timecard": "showTimecardView",
            "timecard/:date": "showTimecardView",
            "mailbox": "showMailBoxView",
        }
    });

    return Router;
});