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

    // Notification Collection, provide the url root for notification update
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

        // model events
        modelEvents: {
            'change:count': 'updateBadge'
        },

        // collection events
        collectionEvents: {
            'remove': 'onRemove'
        },

        // initializer
        initialize: function() {

            var self = this;

            // model is used for retrive notification number
            this.model = new Backbone.Model();

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
                self.collection.add(data, {at: 0});
                // increase the count on model, this will trigger the updateBadge
                self.model.set('count', self.model.get('count') + 1);
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
                self.collection.add(data, {at: 0});
                // increase the count on model, this will trigger the updateBadge
                self.model.set('count', self.model.get('count') + 1);
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
                self.collection.add(data, {at: 0});
                // increase the count on model, this will trigger the updateBadge
                self.model.set('count', self.model.get('count') + 1);
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
                self.collection.add(data, {at: 0});
                // increase the count on model, this will trigger the updateBadge
                self.model.set('count', self.model.get('count') + 1);
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
                self.collection.add(data, {at: 0});
                // increase the count on model, this will trigger the updateBadge
                self.model.set('count', self.model.get('count') + 1);
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
                self.collection.add(data, {at: 0});
                // increase the count on model, this will trigger the updateBadge
                self.model.set('count', self.model.get('count') + 1);
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
                self.collection.add(data, {at: 0});
                // increase the count on model, this will trigger the updateBadge
                self.model.set('count', self.model.get('count') + 1);
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
                self.collection.add(data, {at: 0});
                // increase the count on model, this will trigger the updateBadge
                self.model.set('count', self.model.get('count') + 1);
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
                self.collection.add(data, {at: 0});
                // increase the count on model, this will trigger the updateBadge
                self.model.set('count', self.model.get('count') + 1);
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
                self.collection.add(data, {at: 0});
                // increase the count on model, this will trigger the updateBadge
                self.model.set('count', self.model.get('count') + 1);
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
                self.collection.add(data, {at: 0});
                // increase the count on model, this will trigger the updateBadge
                self.model.set('count', self.model.get('count') + 1);
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
                self.collection.add(data, {at: 0});
                // increase the count on model, this will trigger the updateBadge
                self.model.set('count', self.model.get('count') + 1);
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
                self.collection.add(data, {at: 0});
                // increase the count on model, this will trigger the updateBadge
                self.model.set('count', self.model.get('count') + 1);
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
                self.collection.add(data, {at: 0});
                // increase the count on model, this will trigger the updateBadge
                self.model.set('count', self.model.get('count') + 1);
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
                self.collection.add(data, {at: 0});
                // increase the count on model, this will trigger the updateBadge
                self.model.set('count', self.model.get('count') + 1);
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

            // get the number of notifications
            this.model.fetch({

                // this url only return a number
                url: '/notifications/count?type=unconfirmed',

                // this.model will have only one data: count
                success: function(model, response, options) {

                    // if the nubmer of notification greater than 0
                    if (response.count > 0) {

                        // fetch the notifications
                        self.collection.fetch({
                            url: '/notifications?type=unconfirmed&embed=_from',
                        });

                        // attach infinite scroll
                        self.$el.find(self.childViewContainer).infinitescroll({
                            navSelector  : '#notification_page_nav',
                            nextSelector : '#notification_page_nav a',
                            behavior: 'local',
                            binder: self.$el.find(self.childViewContainer),
                            dataType: 'json',
                            appendCallback: false,
                            loading: {
                                msgText: '<em>読込み中・・・</em>',
                                finishedMsg: '通知は全部読込みました'
                            },
                            path: function(pageNum) {
                                return '/notifications?type=unconfirmed&embed=_from&before=' + moment(self.collection.last().get('createDate')).unix();
                            }
                        }, function(json, opts) {

                            // if there are more data
                            if (json.length > 0)
                                // add data to collection, don't forget parse the json object
                                // this will trigger 'add' event and will call on
                                self.collection.add(json, {parse: true});
                        });
                    }
                }
            });

        },

        // update the number badge when collection changed
        updateBadge: function() {

            var notyNum = this.model.get('count');

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

            // if notification number greater than 0
            if (notyNum > 0)
                // let the icon swing
                this.$el.find('.fa-bell').slShake();
        },

        // when notification removed from collection
        onRemove: function() {

            // discount the data on model, this will trigger the updateBadge
            this.model.set('count', this.model.get('count') - 1);

            // if the collection is shorter than 5
            if (this.collection.length < 5)
                // retrieve more data from infinitescorll
                this.$el.find(this.childViewContainer).infinitescroll('retrieve');
        }
    });
});