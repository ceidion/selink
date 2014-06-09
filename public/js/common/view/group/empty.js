define([
    'text!common/template/group/empty.html'
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({
        template: template
    });
});