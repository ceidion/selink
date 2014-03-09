define([
    'text!common/template/people/history/item-day.html',
    'common/view/people/history/item'
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

            this.collection = new Backbone.Collection(this.model.get('history'));
        },

        onRender: function() {

        }
    });

});