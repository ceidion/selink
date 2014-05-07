define([
    'text!common/template/people/detail/employments.html',
    'common/view/people/detail/employment'
], function(
    template,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // className
        className: 'widget-box',

        // item view container
        itemViewContainer: '.widget-main',

        itemName: 'employments',

        // item view
        itemView: ItemView

    });
});