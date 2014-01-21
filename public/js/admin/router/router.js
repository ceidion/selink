define([], function() {

    var Router = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            "home": "showHomeView",
            "skill": "showSkillsView",
            'profile': 'showProfileView',
            'calendar': 'showCalendarView',
            // "administrator": "showAdministratorView"
        }
    });

    return Router;
});