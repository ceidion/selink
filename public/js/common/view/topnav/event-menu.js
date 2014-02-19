define([
    'text!common/template/topnav/event-menu.html'
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        template: template,

        className: 'light-blue2',

        collectionEvents: {
            'change': 'reflect'
        },

        initialize: function() {

            var nearestEvents = _.filter(this.collection.models, function(event) {
                return moment(event.get('start')).isAfter(moment());
            });

            nearestEvents = _.sortBy(nearestEvents, function(event) {
                return moment(event.get('start')).valueOf();
            });

            this.model.set('nearestEvents', nearestEvents.slice(0, 5), {silent:true});
            this.model.set('eventsNum', nearestEvents.length, {silent:true});
        },

        onShow: function() {
            if (this.model.get('eventsNum') > 0) {
                this.$el.find('.icon-bell-alt').addClass('icon-animated-bell');
            }
        },

        reflect: function() {
            console.log("reflect");
            this.render();
        }

    });
});