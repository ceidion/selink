define([
    'text!common/template/topnav/notification/main.html',
    'common/collection/notifications',
    'common/view/topnav/notification/item',
    'common/view/topnav/notification/empty'
], function(
    template,
    NotificationsModel,
    ItemView,
    EmptyView
) {

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        tagName: 'li',

        // class name
        className: 'light-orange',

        // item view
        itemView: ItemView,

        itemViewContainer: '.dropdown-body',

        emptyView: EmptyView,

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

            // insert sub view before dropdown menu's footer (this is imply a order of items)
            this.$el.find('.dropdown-body').prepend(itemView.el);
        },

        // initializer
        initialize: function() {

            var self = this;

            // create notifications model(collection)
            this.collection = new NotificationsModel();
            this.collection.document = this.model;

            // retrive user's notification
            this.collection.fetch();

            // accept notification real-time
            selink.socket.on('user-friend-invited', function(data) {
                $.gritter.add({
                    title: data._from.firstName + ' ' + data._from.lastName,
                    text: '友達になるリクエストが届きました。',
                    image: data._from.photo,
                    time: 8000,
                    class_name: 'gritter-warning'
                });
                // add the notification to collection
                self.collection.add(data);
            });

            selink.socket.on('user-friend-approved', function(data) {
                $.gritter.add({
                    title: data._from.firstName + ' ' + data._from.lastName,
                    text: 'あなたの友達リクエストを承認しました。',
                    image: data._from.photo,
                    time: 8000,
                    class_name: 'gritter-success'
                });
                // add the notification to collection
                self.collection.add(data);
                // TODO: sync with local user model
                // selink.userModel.get('friend').push(data._from._id);
            });

            selink.socket.on('user-friend-declined', function(data) {
                $.gritter.add({
                    title: data._from.firstName + ' ' + data._from.lastName,
                    text: 'あなたの友達リクエストを拒否しました。',
                    image: data._from.photo,
                    time: 8000,
                    class_name: 'gritter-info'
                });
                // add the notification to collection
                self.collection.add(data);
            });

            selink.socket.on('user-friend-break', function(data) {
                $.gritter.add({
                    title: data._from.firstName + ' ' + data._from.lastName,
                    text: 'あなたと友達を解除しました。',
                    image: data._from.photo,
                    time: 8000,
                    class_name: 'gritter-error'
                });
                // add the notification to collection
                self.collection.add(data);
                // TODO: sync with local user model
                // selink.userModel.get('friend').pull(data._from._id);
            });

            selink.socket.on('user-post-liked', function(data) {
                $.gritter.add({
                    title: data._from.firstName + ' ' + data._from.lastName,
                    text: 'あなたの投稿にいいね！しました。',
                    image: data._from.photo,
                    time: 8000,
                    class_name: 'gritter-success'
                });
                // add the notification to collection
                self.collection.add(data);
            });

            selink.socket.on('user-post-commented', function(data) {
                $.gritter.add({
                    title: data._from.firstName + ' ' + data._from.lastName,
                    text: 'あなたの投稿にコメントしました。',
                    image: data._from.photo,
                    time: 8000,
                    class_name: 'gritter-success'
                });
                // add the notification to collection
                self.collection.add(data);
            });

            selink.socket.on('user-job', function(data) {
                $.gritter.add({
                    title: data._from.firstName + ' ' + data._from.lastName,
                    text: data.content,
                    image: data._from.photo,
                    time: 8000,
                    class_name: 'gritter-success'
                });
                // add the notification to collection
                self.collection.add(data);
            });
        },

        // after show
        onShow: function() {

            // keep dropdown menu open when click on the menu items.
            this.$el.find('.dropdown-menu').on('click', function(e){
                e.stopPropagation();
            });

            // make dropdown menu scrollable
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

            // update notification number on title
            this.$el.find('.title-num').empty().text(notyNum);

            if (notyNum > 0)
                // let the icon swing
                this.$el.find('.icon-bell-alt').addClass('icon-animated-bell');
        }
    });
});