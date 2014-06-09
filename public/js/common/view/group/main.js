define([
    'text!common/template/group/main.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/view/group/groups',
    'common/model/post',
    'common/view/post/item'
], function(
    pageTemplate,
    BaseView,
    BaseCollection,
    GroupsView,
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

            // if (selink.userModel.groups.length)
                // create groups view
                this.groupsView = new GroupsView({collection: selink.userModel.groups});

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
                groupsRegion: '#groups'
            });
        },

        // After show
        onShow: function() {

            if (this.groupsView)
                // show friends view
                this.regions.groupsRegion.show(this.groupsView);

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