define([
    'text!common/template/timeline/item-day.html',
    'common/view/timeline/item'
], function(
    template,
    ItemView) {

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        className: 'timeline-container',

        // item view container
        itemViewContainer: '.timeline-items',

        // item view
        itemView: ItemView,

        // initializer
        initialize: function() {

            this.collection = new Backbone.Collection(this.model.get('activities'));
        },

        onRender: function() {

        }
    });

});