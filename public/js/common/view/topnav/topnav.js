define([
    'text!common/template/topnav/topnav.html',
    'common/view/topnav/event',
    'common/view/topnav/notification/main',
], function(
    template,
    EventMenu,
    NotificationMenu
) {

    var ReplaceRegion = Backbone.Marionette.Region.extend({

        open: function(view) {
            this.$el.hide();
            this.$el.replaceWith(view.el);
            this.$el.slideDown("fast");
        }
    });

    return Backbone.Marionette.Layout.extend({

        // template
        template: template,

        // class name
        className: 'navbar-header pull-right',

        // model events
        modelEvents: {
            'change:photo': 'updatePhoto',
        },

        // regions
        regions: {
            eventNavRegion: {
                selector: '#event-nav',
                regionType: ReplaceRegion
            },
            notificationNavRegion: {
                selector: '#notification-nav',
                regionType: ReplaceRegion
            }
        },

        // initializer
        initialize: function() {

            // create event menu
            this.eventNav = new EventMenu({
                model: this.model
            });

            // create notification menu
            this.notificationNav = new NotificationMenu({
                model: this.model
            });
        },

        // after show
        onShow: function() {

            // show every menu
            this.eventNavRegion.show(this.eventNav);
            this.notificationNavRegion.show(this.notificationNav);
        },

        // update user photo when changed
        updatePhoto: function() {

            var self = this;

            this.$el.find('.nav-user-photo').slRollOut('', function() {
                $(this).attr('src', self.model.get('photo'));
                $(this).removeClass('rollOut').addClass('rollIn');
            });
        }
    });
});