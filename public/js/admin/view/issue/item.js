define([
    'text!admin/template/issue/item.html'
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        // template
        template: template,

        className: 'panel panel-primary',

        // initializer
        initialize: function() {

        }

    });
});