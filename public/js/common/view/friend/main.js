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

        url: function() {
            return '/users/' + this.document.id + '/friends-posts?&embed=_owner,group,comments._owner&per_page=20&page=0';
        }
    });

    return BaseView.extend({

        // Template
        template: pageTemplate,

        // child view
        childView: ItemView,

        // Initializer
        initialize: function() {

            // create firends view
            this.friendsView = new FriendsView({collection: selink.userModel.friends});

            // create posts collection
            this.collection = new PostsCollection(null, {document: selink.userModel});

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

            // show friends view
            this.regions.friendsRegion.show(this.friendsView);

            // call super onShow
            BaseView.prototype.onShow.apply(this);
        },

        // before destroy
        onBeforeDestroy: function() {

            // destroy region manager
            this.rm.destroy();

            // call super onBeforeDestroy
            BaseView.prototype.onBeforeDestroy.apply(this);
        }

    });
});