define([
    'text!common/template/friend/empty.html'
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        template: template
    });
});