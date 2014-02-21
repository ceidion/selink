define([
    'text!common/template/topnav/notification.html',
    'common/view/topnav/notification-item'
], function(
    template,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // class name
        className: 'light-orange',

        // item view
        itemView: ItemView,

        // collection events
        collectionEvents: {
            'add': 'updateBadge',
            'remove': 'updateBadge'
        },

        // override appendHtml
        appendHtml: function(collectionView, itemView, index) {

            // event menu has max 5 items, so the menu
            // itself should has no more than 7 items (include header + footer)
            if (this.$el.find('.dropdown-menu').children().size() >= 7)
                return;

            // event menu only display the future events
            // if (moment(itemView.model.get('start')).isBefore(moment()))
            //     return;

            // insert sub view before dropdown menu's footer (this is imply a order of items)
            this.$el.find('.dropdown-footer').before(itemView.el);
        },

        // initializer
        initialize: function() {

            // filter out the opened notification
            // var nearestNotifications = _.filter(this.collection.models, function(event) {
            //     return moment(event.get('start')).isAfter(moment());
            // });
            // set the number of unread notifications in the model
            this.model.set('notificationsNum', this.collection.length, {silent:true});
        },

        // after show
        onShow: function() {
            // if there are unread notifications
            if (this.model.get('notificationsNum') > 0) {
                // let the icon swing
                this.$el.find('.icon-bell-alt').addClass('icon-animated-bell');
            }
        },

        // update the number badge when collection changed
        updateBadge: function() {

            var notyNum = this.collection.length;

            // badge
            var $badge = this.$el.find('.dropdown-toggle .badge');

            // if no more notifications
            if (notyNum === 0)
                // remove the badge
                $badge.slFlipOutY().remove();
            // if badge not exists
            else if ($badge.length === 0)
                // create badge and show it
                $('<span class="badge badge-danger">' + notyNum + '</span>')
                    .appendTo(this.$el.find('.dropdown-toggle')).slFlipInY();
            // or
            else
                // update badge
                $badge.slFlipOutY(null, function() {
                    $badge.empty().text(notyNum).removeClass('flipOutY').slFlipInY();
                });

        }
    });
});