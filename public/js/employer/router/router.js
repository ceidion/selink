define([], function() {

    var Router = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            'home': 'showHomeView',
            'resume': 'showResumeView',
            'jobIndex': 'showJobIndexView',
            'jobCreate': 'showJobCreateView',
            'jobEdit/:id': 'showJobEditView',
            'timecard': 'showTimeCardView',
        }
    });

    return Router;
});