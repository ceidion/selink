define([
    'text!common/template/friend/item.html'
],function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        template: template,

        tagName: 'li'
    });
});