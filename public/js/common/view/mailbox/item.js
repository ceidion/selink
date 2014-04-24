define([
    'text!common/template/mailbox/item.html'
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        className: 'message-item',

        // template
        template: template
    });
});