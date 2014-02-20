define([
    'text!common/template/topnav/topnav.html',
    'common/view/topnav/event',
    'common/view/topnav/notification',
], function(
    template,
    EventMenu,
    NotificationMenu
) {

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
            eventNavRegion: '#event-nav',
            notificationNavRegion: '#notification-nav',
        },

        // initializer
        initialize: function() {

            // create event menu
            this.eventNav = new EventMenu({
                model: this.model,
                collection: selink.eventsModel
            });

            // create notification menu
            this.notificationNav = new NotificationMenu({
                model: this.model,
                collection: selink.notificationsModel
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