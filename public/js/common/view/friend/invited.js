define([
    'text!common/template/friend/invited.html',
    'common/collection/base',
    'common/view/friend/item',
], function(
    template,
    BaseCollection,
    ItemView
) {

    var Invited = BaseCollection.extend({

        url: '/friends?type=invited'
    });

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // item view container
        itemViewContainer: '.ace-thumbnails',

        // item view
        itemView: ItemView,

        // ui
        ui: {
            container: '.ace-thumbnails'
        },

        // // isotope after collection populated
        // collectionEvents: {
        //     'sync': 'reIsotope',
        // },

        // initializer
        initialize: function() {

            // create collection
            this.collection = new Invited();
            this.collection.fetch();
        },

        // after show
        onShow: function() {
            // make container scrollable
            this.$el.find('.widget-main').slimScroll({
                height: 300,
                railVisible:true
            });
        },

        reIsotope: function() {

            var self = this;

            this.ui.container.imagesLoaded(function() {
                self.ui.container.isotope({
                  // options
                  itemSelector : 'li',
                });
            });
        },
    });

});