define([
    'text!common/template/topnav/notification/menu.html',
    'common/view/topnav/notification/item',
    'common/view/topnav/notification/empty'
], function(
    template,
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

        // initializer
        initialize: function() {

            var self = this;

            this.model = new Backbone.Model();

            // create notifications model(collection)
            this.collection = selink.userModel.notifications;

            // set the number of notifications in the model
            this.model.set('notificationsNum', this.collection.length, {silent:true});

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
                // sync with local user model
                selink.userModel.invited.remove(data._from._id);
                selink.userModel.friends.push(data._from);
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
                // sync with local user model
                selink.userModel.invited.remove(data._from._id);
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
                // sync with local user model
                selink.userModel.friends.remove(data._from._id);
            });

            selink.socket.on('user-post', function(data) {
                $.gritter.add({
                    title: data._from.firstName + ' ' + data._from.lastName,
                    text: '新しい記事を投稿しました。',
                    image: data._from.photo,
                    time: 8000,
                    class_name: 'gritter-success'
                });
                // add the notification to collection
                self.collection.add(data);
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

            selink.socket.on('user-post-bookmarked', function(data) {
                $.gritter.add({
                    title: data._from.firstName + ' ' + data._from.lastName,
                    text: 'あなたの投稿にブックマーク付けました。',
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

            // override appendHtml after the view been shown
            this.appendHtml = function(collectionView, itemView, index) {
                // insert new item into the very begining of the list
                this.$el.find('.dropdown-body').prepend(itemView.el);
            };

            // keep dropdown menu open when click on the menu items.
            this.$el.find('.dropdown-menu').on('click', function(e){
                e.stopPropagation();
            });

            // make dropdown menu scrollable
            this.$el.find('.dropdown-body').niceScroll();

            if (this.collection.length > 0)
                // let the icon swing
                this.$el.find('.icon-bell-alt').slShake();
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
                this.$el.find('.icon-bell-alt').slShake();
        }
    });
});