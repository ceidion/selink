define([
    'text!common/template/topnav/notification/menu.html',
    'common/collection/base',
    'common/view/topnav/notification/item',
    'common/view/topnav/notification/empty'
], function(
    template,
    BaseCollection,
    ItemView,
    EmptyView
) {

    var Notifications = BaseCollection.extend({

        url: '/notifications'
    });

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // tag name
        tagName: 'li',

        // class name
        className: 'light-orange',

        // child view
        childView: ItemView,

        // child view container
        childViewContainer: '.dropdown-body',

        // empty view
        emptyView: EmptyView,

        // collection events
        collectionEvents: {
            'add': 'updateBadge',
            'remove': 'updateBadge'
        },

        // initializer
        initialize: function() {

            var self = this;

            // create notifications collection
            this.collection = new Notifications();

            // accept notification real-time
            selink.socket.on('friend-invited', function(data) {
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

            selink.socket.on('friend-approved', function(data) {
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

            selink.socket.on('friend-declined', function(data) {
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

            selink.socket.on('friend-break', function(data) {
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

            selink.socket.on('post-new', function(data) {
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

            selink.socket.on('post-liked', function(data) {
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

            selink.socket.on('post-bookmarked', function(data) {
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

            selink.socket.on('post-commented', function(data) {
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

            selink.socket.on('comment-liked', function(data) {
                $.gritter.add({
                    title: data._from.firstName + ' ' + data._from.lastName,
                    text: 'あなたのコメントにいいね！しました。',
                    image: data._from.photo,
                    time: 8000,
                    class_name: 'gritter-success'
                });
                // add the notification to collection
                self.collection.add(data);
            });

            selink.socket.on('job-new', function(data) {
                $.gritter.add({
                    title: data._from.firstName + ' ' + data._from.lastName,
                    text: '新しい仕事情報を投稿しました。',
                    image: data._from.photo,
                    time: 8000,
                    class_name: 'gritter-success'
                });
                // add the notification to collection
                self.collection.add(data);
            });

            selink.socket.on('job-bookmarked', function(data) {
                $.gritter.add({
                    title: data._from.firstName + ' ' + data._from.lastName,
                    text: 'あなたの仕事情報にブックマーク付けました。',
                    image: data._from.photo,
                    time: 8000,
                    class_name: 'gritter-success'
                });
                // add the notification to collection
                self.collection.add(data);
            });

            selink.socket.on('group-new', function(data) {
                $.gritter.add({
                    title: data._from.firstName + ' ' + data._from.lastName,
                    text: '新しいグループを立ち上げました。',
                    image: data._from.photo,
                    time: 8000,
                    class_name: 'gritter-success'
                });
                // add the notification to collection
                self.collection.add(data);
            });

            selink.socket.on('group-invited', function(data) {
                $.gritter.add({
                    title: data._from.firstName + ' ' + data._from.lastName,
                    text: 'グループ「' + data.targetGroup.name + '」に招待しました。',
                    image: data._from.photo,
                    time: 8000,
                    class_name: 'gritter-success'
                });
                // add the notification to collection
                self.collection.add(data);
            });

            selink.socket.on('group-joined', function(data) {
                $.gritter.add({
                    title: data._from.firstName + ' ' + data._from.lastName,
                    text: 'グループ「' + data.targetGroup.name + '」に参加しました。',
                    image: data._from.photo,
                    time: 8000,
                    class_name: 'gritter-success'
                });
                // add the notification to collection
                self.collection.add(data);
            });

            selink.socket.on('group-refused', function(data) {
                $.gritter.add({
                    title: data._from.firstName + ' ' + data._from.lastName,
                    text: 'グループ「' + data.targetGroup.name + '」の招待を拒否しました。',
                    image: data._from.photo,
                    time: 8000,
                    class_name: 'gritter-info'
                });
                // add the notification to collection
                self.collection.add(data);
            });
        },

        // after show
        onShow: function() {

            var self = this;

            // keep dropdown menu open when click on the menu items.
            this.$el.find('.dropdown-menu').on('click', function(e){
                e.stopPropagation();
            });

            // make dropdown menu scrollable
            this.$el.find('.dropdown-body').niceScroll();

            this.collection.fetch({
                success: function(collection, response, options) {

                    // make dropdown menu scrollable
                    self.$el.find('.dropdown-body').niceScroll();

                    if (response.length > 0) {                        
                        // let the icon swing
                        self.$el.find('.fa-bell').slJump();

                        self.updateBadge();
                    }
                }
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
                this.$el.find('.fa-bell').slShake();
        }
    });
});