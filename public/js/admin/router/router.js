define([], function() {

    var Router = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            "home": "showHomeView",
            // "administrator": "showAdministratorView"
        }
    });

    return Router;
});