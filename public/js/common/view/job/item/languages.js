define([
    'text!common/template/job/item/languages.html',
    'common/view/job/item/language'
], function(
    template,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // item view container
        itemViewContainer: '.clearfix',

        // item view
        itemView: ItemView,

        // initializer
        initialize: function() {

        },

        onRender: function() {

        },

        onShow: function() {

        }

    });
});