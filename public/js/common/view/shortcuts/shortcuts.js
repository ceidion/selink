define([
    'text!common/template/shortcuts/shortcuts.html'
], function(
    template
) {

    var ShortCuts = Backbone.Marionette.ItemView.extend({

        template: template,

        className: 'sidebar-shortcuts',

        onShow: function() {
        }

    });

    return ShortCuts;
});