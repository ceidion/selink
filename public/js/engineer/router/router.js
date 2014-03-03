define([], function() {

    var Router = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            "home": "showHomeView",
            "profile": "showProfileView",
            "profile/:id": "showProfileView",
            "post": "showPostView",
            "friend": "showFriendView",
            "people": "showPeopleView",
            "calendar": "showCalendarView",
            "timecard": "showTimecardView",
            "timecard/:date": "showTimecardView",
            "mailbox": "showMailBoxView",
        }
    });

    return Router;
});