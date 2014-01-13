define([], function() {

    var Router = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            'home': 'showHomeView',
            'resume': 'showResumeView',
            'caseIndex': 'showCaseIndexView',
            'caseCreate': 'showCaseCreateView',
            'timecard': 'showTimeCardView',
        }
    });

    return Router;
});