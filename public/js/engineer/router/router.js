define([], function() {

    var Router = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            "home": "showHomeView",
            "resume": "showResumeView",
            "timecard": "showTimeCardView",
        }
    });

    return Router;
});