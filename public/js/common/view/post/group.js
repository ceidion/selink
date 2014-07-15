define([
    'text!common/template/post/group.html',
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        tagName: 'li',

        // template
        template: template,

    });
});