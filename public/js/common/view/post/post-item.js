define([
    'common/view/item-base',
    'text!common/template/post/post-item.html'
], function(
    BaseView,
    template) {

    return BaseView.extend({

        // template
        template: template,

        className: 'post-item',

        // initializer
        initialize: function() {
        },

        onRender: function() {
        }
    });

});