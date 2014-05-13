define([
    'text!common/template/job/item/match.html'
],function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        template: template,

        className: 'match-item'
    });
});