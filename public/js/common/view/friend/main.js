define([
    'text!common/template/friend/main.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/view/friend/friend',
    'common/model/post',
    'common/view/post/item'
], function(
    pageTemplate,
    BaseView,
    BaseCollection,
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

        // child view
        childView: ItemView,

        // Initializer
        initialize: function() {

            if (selink.userModel.friends.length)
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
                friendsRegion: '#friends'
            });
        },

        // After show
        onShow: function() {

            if (this.friendsView)
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