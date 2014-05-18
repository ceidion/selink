define([
    'text!common/template/profile/friend.html'
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        // template
        template: template,

        // class name
        className: 'timeline-item grid3 no-padding no-border'

    });
});