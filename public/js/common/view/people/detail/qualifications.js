define([
    'text!common/template/people/detail/qualifications.html',
    'common/view/people/detail/qualification'
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

        itemName: 'qualifications',

        // item view
        itemView: ItemView

    });
});