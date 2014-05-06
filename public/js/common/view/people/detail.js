define([
    'text!common/template/people/detail.html',
    'common/collection/base',
    'common/model/post',
    'common/view/composite-isotope',
    'common/view/post/item',
    // 'common/view/people/history/main',
    'common/view/friend/friend',
    'common/view/people/detail/languages',
    'common/view/mailbox/edit'
], function(
    template,
    BaseCollection,
    PostModel,
    BaseView,
    ItemView,
    // HistoryView,
    FriendsView,
    LanguagesView,
    MessageEditView
) {

    var Posts = BaseCollection.extend({

        model: PostModel,

        url: function() {
            return '/posts?user=' + this.document.id;
        }
    });

    // profile view
    return BaseView.extend({

        // template
        template: template,

        // item view
        itemView: ItemView,

        // events
        events: {
            'click .btn-msg': 'showMessageEditor',
            'click .btn-friend': 'onAddFriend',
            'click .btn-break': 'onBreakFriend'
        },

        // initializer
        initialize: function() {

            var self = this;

            // if this person's id in user's friends list
            if (selink.userModel.friends.get(this.model.get('_id')))
                // mark him as user's friend
                this.model.set('isFriend', true, {silent:true});
            // or if this person's id in user's invitaion list
            else if (selink.userModel.invited.get(this.model.get('_id')))
                // mark him as user's invited friend
                this.model.set('isInvited', true, {silent:true});

            // create friends view
            if (this.model.friends.length)
                this.friendsView = new FriendsView({collection: this.model.friends});

            // create languages view
            if (this.model.languages.length)
                this.languagesView = new LanguagesView({collection: this.model.languages});

            // create post collection
            this.collection = new Posts(null, {document: this.model});

            // call super initializer
            BaseView.prototype.initialize.apply(this);
        },

        // after render
        onRender: function() {
            // create region manager (this composite view will have Layout ability)
            this.rm = new Backbone.Marionette.RegionManager();
            // create regions
            this.regions = this.rm.addRegions({
                // historyRegion: '#history',
                friendsRegion: '#friends',
                languagesRegion: '#languages',
                skillsRegion: '#skills',
                qualificationsRegion: '#qualifications',
                educationsRegion: '#educations',
                employmentsRegion: '#employments',
            });
        },

        // after show
        onShow: function() {

            // show friends view
            if (this.friendsView)
                this.regions.friendsRegion.show(this.friendsView);

            // show languages view
            if (this.languagesView)
                this.regions.languagesRegion.show(this.languagesView);

            // make container scrollable
            this.$el.find('#bio-area').niceScroll({
                horizrailenabled: false
            });

            // call super initializer
            BaseView.prototype.onShow.apply(this);
        },

        // before close
        onBeforeClose: function() {
            // close region manager
            this.rm.close();
        },

        showMessageEditor: function() {

            var messageEditor = new MessageEditView({
                recipient: [this.model]
            });

            selink.modalArea.show(messageEditor);
            selink.modalArea.$el.modal('show');
        },

        // add this person as friend
        onAddFriend: function() {

            var self = this;

            // show loading icon, and prevent user click twice
            this.$el.find('.btn-friend').button('loading');

            // create a friend in invited list
            selink.userModel.invited.create({
                _id: this.model.get('_id')
            }, {
                success: function() {
                    // change the label of the add button, but still disabled
                    self.$el.find('.btn-friend')
                        .removeClass('btn-info btn-friend')
                        .addClass('btn-success')
                        .empty()
                        .html('<i class="icon-ok light-green"></i>&nbsp;友達リクエスト送信済み');
                },
                patch: true,
                wait: true
            });
        },

        // break up with this person
        onBreakFriend: function() {

            var self = this;

            // show loading icon, and prevent user click twice
            this.$el.find('.btn-break').button('loading');

            // remove this person from user's friends list
            selink.userModel.friends.get(this.model.get('_id')).destroy({

                success: function() {
                    // change the button for success info, but won't enable it
                    self.$el.find('.btn-break')
                        .removeClass('btn-info btn-break')
                        .addClass('btn-grey')
                        .empty()
                        .html('<i class="icon-ok light-green"></i>&nbsp;友達解除しました');
                }
            });
        }

    });
});