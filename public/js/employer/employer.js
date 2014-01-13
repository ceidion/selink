define([
    'view/home/page',
    'router/router',
    'controller/controller'
], function(
    HomeView,
    Router,
    Controller
) {

    // create application instance
    var employer = new Backbone.Marionette.Application();

    // create regions
    employer.addRegions({
        pageContent: '.page-content',
        topnavArea: '#topnav-area',
        sidenavArea: '#sidenav-area'
    });

    // before application initialization, config every plug-ins
    employer.on('initialize:before', function(options) {

        // THIS IS VITAL, change the default behavior of views load template,
        // or the underscore template won't work
        Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(templateId) {

            var template = templateId;

            if (!template || template.length === 0) {
                var msg = "Could not find template: '" + templateId + "'";
                var err = new Error(msg);
                err.name = "NoTemplateError";
                throw err;
            }
            return template;
        };

        // change datetime language
        moment.lang('ja');

        // add custom validator method
        $.validator.addMethod('dateJa', function(value, element) {
            return moment(value, 'YYYY/MM/DD').isValid();
        }, "有効な日付をご入力ください");

        // gritter setting
        $.extend($.gritter.options, {
            position: 'bottom-right',
            sticky: false,
            time: 3000,
            before_open: function(){
                if($('.gritter-item-wrapper').length >= 3)
                    return false;
            },
        });
    });

    // initialize application
    employer.addInitializer(function(options) {

        // create home view
        this.homeView = new HomeView();
        // create resume view
        // this.resumeView = new ResumeView();
        // create time card view
        // this.timeCardView = new TimeCardView();

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

    return employer;
});