define([
    'text!common/template/post/main.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/model/post',
    'common/view/post/item',
    'common/view/post/create'
], function(
    template,
    BaseView,
    BaseCollection,
    PostModel,
    ItemView,
    CreateView
) {

    var PostsCollection = BaseCollection.extend({

        model: PostModel,

        url: '/posts'
    });

    return BaseView.extend({

        // template
        template: template,

        // child view
        childView: ItemView,

        // initializer
        initialize: function() {

            this.selectGroup = null;

            // create posts collection
            this.collection = new PostsCollection();

            // create region manager (this composite view will have layout ability)
            this.rm = new Backbone.Marionette.RegionManager();

            // create regions
            this.regions = this.rm.addRegions({
                createRegion: '#new-post',
            });

            this.createView = new CreateView();

        },

        // After show
        onShow: function() {

            this.regions.createRegion.show(this.createView);

            // call super onShow
            BaseView.prototype.onShow.apply(this);
        }

    });
});