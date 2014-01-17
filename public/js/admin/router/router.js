define([], function() {

    var Router = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            "home": "showHomeView",
            "skill": "showSkillsView",
            'resume': 'showResumeView',
            'timecard': 'showTimeCardView',
            // "administrator": "showAdministratorView"
        }
    });

    return Router;
});