define([
    'text!common/template/people/detail/educations.html',
    'common/view/people/detail/education'
], function(
    template,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // className
        className: 'widget-box transparent',

        // item view container
        itemViewContainer: '.widget-main',

        // item view
        itemView: ItemView

    });
});