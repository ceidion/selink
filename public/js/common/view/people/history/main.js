define([
    'text!common/template/people/history/main.html',
    'common/view/people/history/item-day'
], function(
    template,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // for dnd add class here
        className: 'widget-box transparent',

        // item view container
        itemViewContainer: '.timeline-block',

        // item view
        itemView: ItemView,

        // initializer
        initialize: function() {

        },

        onRender: function() {

        }
    });

});