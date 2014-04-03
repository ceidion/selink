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
            "activity": "showActivityView",
            "skill": "showSkillsView",
        }
    });

    return Router;
});