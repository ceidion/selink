define([
    'text!common/template/topnav/event-menu.html'
], function(
    template
) {

    var TopNav = Backbone.Marionette.ItemView.extend({

        template: template,

        className: 'light-blue2',

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
            if (this.model.get('nearestEventsNum') > 0) {
                this.$el.find('.icon-bell-alt').addClass('icon-animated-bell');
            }
        },

    });

    return TopNav;
});