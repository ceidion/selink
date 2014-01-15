define([
    'common/view/topnav/topnav',
    'employer/view/common/sidenav',
    'employer/view/home/page',
    'common/view/resume/resume',
    'employer/view/case/index',
    'employer/view/case/create',
    'common/view/timecard/timecard',
], function(
    TopNavView,
    SideNavView,
    HomeView,
    ResumeView,
    CaseIndexView,
    CaseCreateView,
    TimeCardView
) {

    // Main page controller
    var Controller = Backbone.Marionette.Controller.extend({

        // Initializer of main page controller
        initialize: function(options) {

            var self = this;

            // hold application ref
            this.app = options.app;

            this.showNavigation();
        },

        showNavigation: function() {

            // setup side nav
            this.app.sideNavView = new SideNavView();
            this.app.sidenavArea.show(this.app.sideNavView);

            this.app.topNavView = new TopNavView({
                model: this.app.userModel
            });
            this.app.topnavArea.show(this.app.topNavView);
        },

        showHomeView: function() {
            // create home view
            this.homeView = new HomeView();
            // show main page
            this.app.pageContent.show(this.app.homeView);
        },

        // show resume
        showResumeView: function() {

            // create resume view
            this.app.resumeView = new ResumeView({
                model: this.app.profileModel
            });
            // show resume view
            this.app.pageContent.show(this.app.resumeView);
        },

        showCaseIndexView: function() {
            this.app.caseIndexView = new CaseIndexView();
            this.app.pageContent.show(this.app.caseIndexView);
        },

        showCaseCreateView: function() {
            this.app.caseCreateView = new CaseCreateView();
            this.app.pageContent.show(this.app.caseCreateView);
        },

        // show time card
        showTimeCardView: function() {

            this.app.timeCardView = new TimeCardView({
                collection: this.app.eventsModel
            });

            this.app.pageContent.show(this.app.timeCardView);
        }

    });

    return Controller;
});