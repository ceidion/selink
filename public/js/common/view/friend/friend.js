define([
    'text!common/template/friend/friend.html',
    'common/view/friend/friend-item',
], function(
    template,
    ItemView) {

    var Introductions = Backbone.Collection.extend({

        idAttribute: "_id",

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url: '/friends'
    });

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // for dnd add class here
        // className: 'widget-box transparent',

        // item view container
        itemViewContainer: '.ace-thumbnails',

        // item view
        itemView: ItemView,

        // max item number
        // itemLimit: 6,

        collectionEvents: {
            'sync': 'reIsotope',
        },

        // initializer
        initialize: function() {

            var self = this;

            this.events = _.extend({}, this.events);

            this.collection = new Introductions();
            this.collection.fetch({
                success: function() {
                    console.log("got " + self.collection.length + " frineds");
                }
            });
        },

        onRender: function() {

        },

        reIsotope: function() {

            $('.ace-thumbnails').imagesLoaded(function() {
                $('.ace-thumbnails').isotope({
                  // options
                  itemSelector : 'li',
                });
            });
        },
    });

});