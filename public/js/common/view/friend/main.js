define([
    'text!common/template/friend/main.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/view/friend/invited',
    'common/view/friend/friend',
    'common/model/post',
    'common/view/post/item'
], function(
    pageTemplate,
    BaseView,
    BaseCollection,
    InvitedView,
    FriendsView,
    PostModel,
    ItemView
) {

    var PostsCollection = BaseCollection.extend({

        model: PostModel,

        url: '/posts?category=friend'
    });

    return BaseView.extend({

        // Template
        template: pageTemplate,

        // item view
        itemView: ItemView,

        // Initializer
        initialize: function() {

            // create invited friends view
            this.invitedView = new InvitedView({collection: selink.userModel.invited});

            // create firends view
            this.friendsView = new FriendsView({collection: selink.userModel.friends});

            // create posts collection
            this.collection = new PostsCollection();

            // call super initializer
            BaseView.prototype.initialize.apply(this);
        },

        // After render
        onRender: function() {

            // create region manager (this composite view will have layout ability)
            this.rm = new Backbone.Marionette.RegionManager();
            // create regions
            this.regions = this.rm.addRegions({
                invitedRegion: '#invited',
                friendsRegion: '#friends'
            });
        },

        // After show
        onShow: function() {

            // show invited friends view
            this.regions.invitedRegion.show(this.invitedView);
            // show friends view
            this.regions.friendsRegion.show(this.friendsView);

            // call super onShow
            BaseView.prototype.onShow.apply(this);
        },

        // before close
        onBeforeClose: function() {

            // close region manager
            this.rm.close();

            // call super onBeforeClose
            BaseView.prototype.onBeforeClose.apply(this);
        }

    });
});