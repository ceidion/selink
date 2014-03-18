define([
    'text!common/template/post/comment.html'
],function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        template: template,

        className: 'itemdiv dialogdiv'

    });
});