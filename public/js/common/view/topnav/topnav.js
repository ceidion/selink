define([
    'text!common/template/topnav/topnav.html',
    'common/view/topnav/event-menu',
    'common/view/topnav/notification-menu',
], function(
    template,
    EventMenu,
    NotificationMenu
) {

    var TopNav = Backbone.Marionette.Layout.extend({

        template: template,

        className: 'navbar-header pull-right',

        modelEvents: {
            'change:photo': 'updatePhoto',
        },

        // collectionEvents: {
        //     'change': 'reflect'
        // },

        // regions
        regions: {
            eventNavRegion: '#event-nav',
            notificationNavRegion: '#notification-nav',
        },

        initialize: function() {

            // create component
            this.eventNav = new EventMenu({
                model: this.model,
                collection: selink.eventsModel
            });

            this.notificationNav = new NotificationMenu({
                model: this.model,
                collection: selink.notificationsModel
            });
        },

        onShow: function() {

            // show every component
            this.eventNavRegion.show(this.eventNav);
            this.notificationNavRegion.show(this.notificationNav);
        },

        // reflect: function() {

        //     this.eventNav = new EventMenu({model: this.model, collection: this.collection});
        //     this.eventNavRegion.show(this.eventNav);
        // },

        updatePhoto: function() {

            var self = this;

            this.$el.find('.nav-user-photo').slRollOut('', function() {
                $(this).attr('src', self.model.get('photo'));
                $(this).removeClass('rollOut').addClass('rollIn');
            });
        },

        // updateEvent: function() {
        //     console.log("event changed");
        // }

    });

    return TopNav;
});