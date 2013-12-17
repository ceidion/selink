define([
    'view/common/sidenav',
    'view/home/page',
    'view/resume/resume',
    'view/timecard/timecard',
    'router/router',
    'controller/controller'
], function(
    SideNavView,
    HomeView,
    ResumeView,
    TimeCardView,
    Router,
    Controller
) {

    // create application instance
    var engineer = new Backbone.Marionette.Application();

    // create regions
    engineer.addRegions({
        pageContent: '.page-content'
    });

    // initialize application
    engineer.addInitializer(function(options) {

        // setup side nav
        this.sideNavView = new SideNavView({el: '#sidebar'});

        // create home view
        this.homeView = new HomeView();
        // create resume view
        this.resumeView = new ResumeView();
        // create time card view
        this.timeCardView = new TimeCardView();

        // switch page with fade effect
        Backbone.Marionette.Region.prototype.open = function(view){
            this.$el.hide();
            this.$el.html(view.el);
            this.$el.fadeIn();
        };

        // make controller
        var controller = new Controller({
            app: this
        });

        // setup router
        var router = new Router({
            controller: controller
        });

        // start history
        Backbone.history.start();
    });

    return engineer;
});