define([
    'common/collection/base',
    'common/model/event',
    'common/model/user',
    'engineer/router/router',
    'engineer/controller/controller'
], function(
    BaseCollection,
    EventModel,
    UserModel,
    Router,
    Controller
) {

    var Events = BaseCollection.extend({

        model: EventModel,

        url:  '/events',

        comparator: function(event) {
            // sort by start desc
            return Number(event.get('start').valueOf());
        }
    });

    var Notifications = BaseCollection.extend({

        url: '/notifications'
    });

    // create application instance
    window.selink = new Backbone.Marionette.Application();

    // create regions
    selink.addRegions({
        pageContent: '.page-content',
        topnavArea: '#topnav-area',
        shortcutArea: '#shortcuts-area',
        sidenavArea: '#sidenav-area',
        modalArea: '#modal-area'
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

        $("html").niceScroll({
            scrollspeed: 120,
            mousescrollstep: 80,
            horizrailenabled: false
        });

        // body listen to click event, for close sl-editor, if any
        $('body').bind('click', closeEditor);

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

                self.userModel.events = new Events();
                self.userModel.events.fetch({

                    success: function() {

                        self.userModel.notifications = new Notifications();
                        self.userModel.notifications.fetch({

                            success: function() {

                                // make controller
                                self.controller = new Controller();

                                // setup router
                                self.router = new Router({
                                    controller: self.controller
                                });

                                // start history
                                Backbone.history.start();
                            }
                        });
                    }
                });
            },

            // on error
            error: function() {
                // show the error to user
            }
        });

        // initiate web socket
        this.socket = io.connect('/');

        // web socket handler
        this.socket.on('message', function(data) {
            $.gritter.add({
                title: data.title,
                text: data.msg,
                class_name: 'gritter-success'
            });
        });

        // web socket handler
        this.socket.on('user-login', function(data) {
            $.gritter.add({
                title: data.firstName + ' ' + data.lastName,
                text: 'オンラインになりました',
                image: data.photo,
                class_name: 'gritter-success'
            });
        });

        // web socket handler
        this.socket.on('no-session', function(data) {
            $.gritter.add({
                title: 'セッションが切りました',
                text: 'お手数ですが、もう一度ログインしてください。',
                class_name: 'gritter-error'
            });
        });

    });

    // profile view handle the click event
    // -- switch component in editor mode to value mode
    // *from x-editable*
    var closeEditor = function(e) {
        var $target = $(e.target), i,
            exclude_classes = ['.editable-container',
                               '.ui-datepicker-header',
                               '.datepicker', //in inline mode datepicker is rendered into body
                               '.modal-backdrop',
                               '.bootstrap-wysihtml5-insert-image-modal',
                               '.bootstrap-wysihtml5-insert-link-modal'
                               ];

        //check if element is detached. It occurs when clicking in bootstrap datepicker
        if (!$.contains(document.documentElement, e.target)) {
          return;
        }

        //for some reason FF 20 generates extra event (click) in select2 widget with e.target = document
        //we need to filter it via construction below. See https://github.com/vitalets/x-editable/issues/199
        //Possibly related to http://stackoverflow.com/questions/10119793/why-does-firefox-react-differently-from-webkit-and-ie-to-click-event-on-selec
        if($target.is(document)) {
           return;
        }

        //if click inside one of exclude classes --> no nothing
        for(i=0; i<exclude_classes.length; i++) {
             if($target.is(exclude_classes[i]) || $target.parents(exclude_classes[i]).length) {
                 return;
             }
        }

        //close all open containers (except one - target)
        closeOthers(e.target);
    };

    // close all open containers (except one - target)
    var closeOthers = function(element) {

        $('.sl-editor-open').each(function(i, el){

            var $el = $(el);

            //do nothing with passed element and it's children
            if(el === element || $el.find(element).length) {
                return;
            }

            if($el.find('.form-group').hasClass('has-error')) {
                return;
            }

            // slide up the edit panel
            $el.find('.sl-editor').slideUp('fast', function() {
                // fadeIn view panel
                $el.find('.sl-value').fadeIn('fast');
            });

            $el.removeClass('sl-editor-open');
        });
    };

    return selink;
});