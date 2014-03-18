define([], function() {

    var Router = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            'home': 'showHomeView',
            'profile': 'showProfileView',
            "profile/:id": "showProfileView",
            "post": "showPostView",
            'jobIndex': 'showJobIndexView',
            'jobCreate': 'showJobCreateView',
            'jobEdit/:id': 'showJobEditView',
            "friend": "showFriendView",
            "people": "showPeopleView",
            'calendar': 'showCalendarView',
            "mailbox": "showMailBoxView",
        }
    });

    return Router;
});