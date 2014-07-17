define([
    'text!common/template/friend/friend.html',
    'common/collection/base',
    'common/view/friend/item',
], function(
    template,
    BaseCollection,
    ItemView
) {

    var FriendsCollection = BaseCollection.extend({

        url: '/connections?fields=type,firstName,lastName,title,cover,photo,createDate'
    });

    return Backbone.Marionette.CompositeView.extend({

        // class name
        className: "widget-box widget-color-green",

        // template
        template: template,

        // child view container
        childViewContainer: '.widget-main',

        // child view
        childView: ItemView,

        // Initializer
        initialize: function() {

            // create posts collection
            this.collection = new FriendsCollection();
        },

        attachHtml: function(collectionView, itemView, index) {

            var self = this;

            // ensure the image are loaded
            itemView.$el.imagesLoaded(function() {
                // prepend new item and reIsotope
                self.$el.find(self.childViewContainer).isotope('insert', itemView.$el);
            });
        },

        // after show
        onShow: function() {

            var self = this;

            // enable isotope
            this.$el.find(this.childViewContainer).isotope({
                itemSelector : '.photo-item'
            });

            // make container scrollable
            this.$el.find('.widget-main').niceScroll({
                horizrailenabled: false
            });

            // fetch collection items
            this.collection.fetch({
                // after collection populate
                success: function() {
                    // call layout after 0.5s, for ensure the layout
                    setTimeout(function() {
                        self.$el.find(this.childViewContainer).isotope('layout');
                    }, 500);
                }
            });
        },

        // TODO: remove on friend-break
        onBeforeRemoveChild: function() {
            // console.log(arguments);
        },

        onAddChild: function() {
            // console.log(arguments);
        }

    });
});