define([
    'text!common/template/topnav/topnav.html',
    'common/view/topnav/event-menu'
], function(
    template,
    EventMenu
) {

    var TopNav = Backbone.Marionette.Layout.extend({

        template: template,

        className: 'navbar-header pull-right',

        modelEvents: {
            'change:photo': 'updatePhoto',
        },

        collectionEvents: {
            'change': 'reflect'
        },

        // regions
        regions: {
            eventNavRegion: '#event-nav',
        },

        initialize: function() {

            // create component
            this.eventNav = new EventMenu({model: this.model, collection: this.collection});
        },

        onShow: function() {

            // show every component
            this.eventNavRegion.show(this.eventNav);
        },

        reflect: function() {

            this.eventNav = new EventMenu({model: this.model, collection: this.collection});
            this.eventNavRegion.show(this.eventNav);
        },

        updatePhoto: function() {

            var self = this;

            this.$el.find('.nav-user-photo')
                .addClass('animated rollOut')
                .one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd animationend', function() {
                    $(this).attr('src', self.model.get('photo'));
                    $(this).removeClass('rollOut').addClass('rollIn');
                });
        },

        updateEvent: function() {
            console.log("event changed");
        }

    });

    return TopNav;
});