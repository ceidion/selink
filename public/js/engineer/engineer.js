define([
    'common/model/user',
    'common/model/profile',
    'common/collection/events',
    'engineer/router/router',
    'engineer/controller/controller'
], function(
    UserModel,
    ProfileModel,
    EventsModel,
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

    // before application initialization, config plug-ins
    engineer.on('initialize:before', function(options) {

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

        // switch page with fade effect
        Backbone.Marionette.Region.prototype.open = function(view){
            this.$el.hide();
            this.$el.html(view.el);
            this.$el.fadeIn();
        };

        // change datetime language
        moment.lang('ja');

        // custom validation method
        _.extend(Backbone.Validation.validators, {
            dateJa: function(value, attr, customValue, model) {
                if (value && !moment(value, 'YYYY/MM/DD').isValid())
                    return "有効な日付をご入力ください";
            }
        });

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
    engineer.addInitializer(function(options) {

        var self = this;

        // create user model
        this.userModel = new UserModel({
            _id: $('#info-base').data('id')
        });

        // populate user model
        this.userModel.fetch({

            // on success
            success: function() {

                // create profile model from user model
                self.profileModel = new ProfileModel(self.userModel.get('profile'), {parse: true});
                // create events model(collection) from user model
                self.eventsModel = new EventsModel(self.userModel.get('events'), {parse: true});
                self.eventsModel.document = self.userModel;

                // make controller
                var controller = new Controller({
                    app: self
                });

                // setup router
                var router = new Router({
                    controller: controller
                });

                // start history
                Backbone.history.start();
            },

            // on error
            error: function() {
                // show the error to user
            }
        });
    });

    return engineer;
});