define([
    'text!common/template/people/detail/languages.html',
    'common/view/people/detail/language'
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

        itemName: 'languages',

        // item view
        itemView: ItemView

    });
});