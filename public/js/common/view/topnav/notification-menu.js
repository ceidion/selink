define([
    'text!common/template/topnav/notification-menu.html'
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        template: template,

        className: 'light-orange',

        initialize: function() {

            var nearestNotifications = _.filter(this.collection.models, function(event) {
                return moment(event.get('start')).isAfter(moment());
            });

            nearestNotifications = _.sortBy(nearestNotifications, function(event) {
                return moment(event.get('start')).valueOf();
            });

            this.model.set('nearestNotifications', nearestNotifications.slice(0, 5), {silent:true});
            this.model.set('notificationsNum', nearestNotifications.length, {silent:true});
        },

        onShow: function() {
            if (this.model.get('notificationsNum') > 0) {
                this.$el.find('.icon-bell-alt').addClass('icon-animated-bell');
            }
        },

    });
});