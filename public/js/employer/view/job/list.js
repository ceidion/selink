define([
    'text!employer/template/job/list.html',
    'employer/view/job/widget'
], function(
    template,
    ItemView
) {

    return Backbone.Marionette.CollectionView.extend({

        // Template
        template: template,

        // item view container
        itemViewContainer: this.$el,

        // item view
        itemView: ItemView,

        // collection events
        collectionEvents: {
            'sync': 'reIsotope',
        },

        // Initializer
        initialize: function() {
            // change the behavior of add sub view
            this.appendHtml = function(collectionView, itemView, index) {
                // prepend new post and reIsotope
                this.$el.prepend(itemView.$el).isotope('reloadItems');
            };
        },

        // re-isotope after collection get synced
        reIsotope: function() {

            var self = this;

            this.$el.imagesLoaded(function() {
                self.$el.isotope({
                    layoutMode: 'selinkMasonry',
                    itemSelector : '.job-item',
                    resizable: false
                });
            });
        }
    });
});