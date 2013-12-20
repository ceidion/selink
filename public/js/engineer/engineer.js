define([
    'view/common/topnav',
    'view/common/sidenav',
    'view/home/page',
    // 'view/resume/resume',
    'view/timecard/timecard',
    'router/router',
    'controller/controller'
], function(
    TopNavView,
    SideNavView,
    HomeView,
    // ResumeView,
    TimeCardView,
    Router,
    Controller
) {

    // create application instance
    var engineer = new Backbone.Marionette.Application();

    // create regions
    engineer.addRegions({
        pageContent: '.page-content',
        topnavArea: '#topnav-area',
        sidenavArea: '#sidenav-area'
    });

    // initialize application
    engineer.addInitializer(function(options) {

        // create home view
        this.homeView = new HomeView();
        // create resume view
        // this.resumeView = new ResumeView();
        // create time card view
        this.timeCardView = new TimeCardView();

        // switch page with fade effect
        Backbone.Marionette.Region.prototype.open = function(view){
            this.$el.hide();
            this.$el.html(view.el);
            this.$el.fadeIn();
        };

        // setup side nav
        this.sideNavView = new SideNavView();
        this.sidenavArea.show(this.sideNavView);

        // setup top nav
        this.topNavView = new TopNavView();
        this.topnavArea.show(this.topNavView);

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