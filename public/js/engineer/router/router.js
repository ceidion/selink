define([], function() {

    var Router = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            "home": "showHomeView",
            "profile": "showProfileView",
            "calendar": "showCalendarView",
            "timecard": "showTimecardView",
            "mailbox": "showMailBoxView",
        }
    });

    return Router;
});