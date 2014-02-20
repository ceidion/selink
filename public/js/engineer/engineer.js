define([
    'common/model/user',
    'common/collection/activities',
    'common/collection/events',
    'common/collection/notifications',
    'common/collection/friends',
    'engineer/router/router',
    'engineer/controller/controller'
], function(
    UserModel,
    ActivitiesModel,
    EventsModel,
    NotificationsModel,
    FriendsModel,
    Router,
    Controller
) {

    // create application instance
    window.selink = new Backbone.Marionette.Application();

    // create regions
    selink.addRegions({
        pageContent: '.page-content',
        topnavArea: '#topnav-area',
        shortcutArea: '#shortcuts-area',
        sidenavArea: '#sidenav-area'
    });

    // before application initialization, config plug-ins
    selink.on('initialize:before', function(options) {

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
    selink.addInitializer(function(options) {

        var self = this;

        // create user model
        this.userModel = new UserModel({
            _id: $('#info-base').data('id')
        });

        // populate user model
        this.userModel.fetch({

            // on success
            success: function() {

                // create events model(collection) from user model
                self.eventsModel = new EventsModel(self.userModel.get('events'), {
                    parse: true,
                    comparator: function(event) {
                        // sort by start desc
                        return Number(event.get('start').valueOf());
                    }
                });
                self.eventsModel.document = self.userModel;

                // create notifications model(collection) from user model
                self.notificationsModel = new NotificationsModel(self.userModel.get('notifications'), {
                    parse: true,
                    comparator: function(notification) {
                        // sort by start asc
                        return 0 - Number(moment(notification.get('createDate')).valueOf());
                    }
                });
                self.notificationsModel.document = self.userModel;

                // create friends model(collection) from user model
                self.friendsModel = new FriendsModel(self.userModel.get('friends'), {parse: true});
                self.friendsModel.document = self.userModel;

                self.waitApproveModel = new FriendsModel(self.userModel.get('waitApprove'), {parse: true});
                self.waitApproveModel.document = self.userModel;

                // make controller
                var controller = new Controller();

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

        // // create user activities model
        // this.userActivitiesModel = new ActivitiesModel();
        // this.userActivitiesModel.document = this.userModel;

        // initiate web socket
        var socket = io.connect('http://localhost:8081');
        // web socket handler
        socket.on('message', function(data) {
            setTimeout(function() {
                $.gritter.add({
                    title: data.title,
                    text: data.msg,
                    class_name: 'gritter-success'
                });
            }, 3000);
        });

        socket.on('notification', function(data) {
            $.gritter.add({
                title: data.title,
                text: data.content,
                image: data._from.photo,
                time: 8000,
                class_name: 'gritter-warning'
            });

            selink.notificationsModel.add(data);
        });

    });

    return selink;
});