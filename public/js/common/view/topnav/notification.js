define([
    'text!common/template/topnav/notification.html',
    'common/collection/notifications',
    'common/view/topnav/notification-item'
], function(
    template,
    NotificationsModel,
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
            // if (this.$el.find('.dropdown-menu').children().size() >= 7)
            //     return;

            // event menu only display the future events
            // if (moment(itemView.model.get('start')).isBefore(moment()))
            //     return;

            // insert sub view before dropdown menu's footer (this is imply a order of items)
            this.$el.find('.dropdown-body').append(itemView.el);
        },

        // initializer
        initialize: function() {

            var self = this;

            // create notifications model(collection)
            this.collection = new NotificationsModel([], {
                comparator: function(notification) {
                    // sort by start asc
                    return Number(moment(notification.get('createDate')).valueOf());
                }
            });
            this.collection.document = this.model;

            this.collection.fetch();

            selink.socket.on('notification', function(data) {
                $.gritter.add({
                    title: data.title,
                    text: data.content,
                    image: data._from.photo,
                    time: 8000,
                    class_name: 'gritter-warning'
                });

                self.collection.add(data);
            });
        },

        // after show
        onShow: function() {

            // keep dropdown menu open when click on the menu items.
            this.$el.find('.dropdown-menu').on('click', function(e){
                e.stopPropagation();
            });

            // if there are unread notifications
            if (this.model.get('notificationsNum') > 0) {
                // let the icon swing
                this.$el.find('.icon-bell-alt').addClass('icon-animated-bell');
            }

            this.$el.find('.dropdown-body').slimScroll({
                height: 300,
                railVisible:true
            });
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