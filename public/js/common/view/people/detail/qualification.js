define([
    'text!common/template/people/detail/qualification.html'
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        // template
        template: template,

        // class name
        className: 'sl-editable'

    });
});