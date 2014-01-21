define([], function() {

    var Router = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            'home': 'showHomeView',
            'profile': 'showProfileView',
            'jobIndex': 'showJobIndexView',
            'jobCreate': 'showJobCreateView',
            'jobEdit/:id': 'showJobEditView',
            'calendar': 'showCalendarView',
        }
    });

    return Router;
});