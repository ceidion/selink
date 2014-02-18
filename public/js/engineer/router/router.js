define([], function() {

    var Router = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            "home": "showHomeView",
            "profile": "showProfileView",
            "posts": "showPostView",
            "calendar": "showCalendarView",
            "timecard": "showTimecardView",
            "timecard/:date": "showTimecardView",
            "mailbox": "showMailBoxView",
        }
    });

    return Router;
});