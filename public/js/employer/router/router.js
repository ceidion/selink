define([], function() {

    var Router = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            "home": "showHomeView",
            "profile": "showProfileView",
            "profile/:id": "showProfileView",
            "post": "showPostView",
            "post/:id": "showPostView",
            'job': 'showJobView',
            "friend": "showFriendView",
            "people": "showPeopleView",
            "calendar": "showCalendarView",
            "activity": "showActivityView",
            // "timecard": "showTimecardView",
            // "timecard/:date": "showTimecardView",
            // "mailbox": "showMailBoxView",
        }
    });

    return Router;
});