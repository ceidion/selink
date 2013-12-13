define([
    'view/common/sidenav',
    'view/home/page',
    'view/resume/resume',
    'router/router',
    'controller/controller'
], function(
    SideNavView,
    HomeView,
    ResumeView,
    Router,
    Controller
) {

    var Admin = new Backbone.Marionette.Application();

    Admin.addRegions({
        pageContent: '.page-content'
    });

    Admin.addInitializer(function(options) {

        this.sideNavView = new SideNavView({el: '#sidebar'});

        this.homeView = new HomeView();
        this.resumeView = new ResumeView();

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

        Backbone.history.start();
    });

    return Admin;
});