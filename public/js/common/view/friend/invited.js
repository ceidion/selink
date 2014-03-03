define([
    'text!common/template/friend/invited.html',
    'common/view/friend/item',
], function(
    template,
    ItemView) {

    var WaitApprove = Backbone.Collection.extend({

        idAttribute: "_id",

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url: function() {
            return this.document.url() + '/friends?type=requested';
        }
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

        // isotope after collection populated
        collectionEvents: {
            'sync': 'reIsotope',
        },

        // initializer
        initialize: function() {

            // create collection
            this.collection = new WaitApprove();
            this.collection.document = this.model;
            this.collection.fetch();
        },

        // after show
        onShow: function() {
            // make container scrollable
            this.ui.container.slimScroll({
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