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
            'change': 'render'
        },

        initialize: function() {


            var nearestEvents = _.filter(this.collection.models, function(event) {
                return moment(event.get('start')).isAfter(moment());
            });

            nearestEvents = _.sortBy(nearestEvents, function(event) {
                return moment(event.get('start')).valueOf();
            });

            this.model.set('nearestEvents', nearestEvents.slice(0, 5), {silent:true});
            this.model.set('nearestEventsNum', nearestEvents.length, {silent:true});
        },

        onShow: function() {
            // this.$el.addClass('animated fadeInRight');
            new EventMenu({
                el: 'body'
            })
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