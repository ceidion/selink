define([
    'text!common/template/job/item/skills.html',
    'common/view/job/item/skill'
], function(
    template,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // item view container
        itemViewContainer: '.profile-skills',

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