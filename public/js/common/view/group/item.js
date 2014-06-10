define([
    'text!common/template/group/item.html'
],function(
    template,
    popoverTemplate
) {

    return Backbone.Marionette.ItemView.extend({

        template: template,

        className: 'photo-item no-padding'

    });
});