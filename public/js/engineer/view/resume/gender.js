define([
    'view/common/item-base',
    'text!template/resume/gender.html'
], function(
    BaseView,
    template) {

    var GenderItem = BaseView.extend({

        // template
        template: template,

        // initializer
        initialize: function() {
            // this.ui = _.extend({}, this.commonUI);
            // this.events = _.extend({}, this.commonEvents);
        },

        // after render
        onRender: function() {

        }
    });

    return GenderItem;
});