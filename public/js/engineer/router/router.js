define([], function() {

    var Router = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            "home": "showHomeView",
            "resume": "showResumeView"
        }
    });

    return Router;
});