define([
    'view/common/item-base',
    'text!template/resume/birthday.html'
], function(
    BaseView,
    template) {

    // birth day item
    var BirthDayItem = BaseView.extend({

        // template
        template: template,

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.commonUI);
            this.events = _.extend({}, this.commonEvents);
        },

        // after render
        onRender: function() {

            // append data picker
            this.$el.find('#birthday-item').datepicker({
                autoclose: true,
                language: 'ja'
            });

            // enable mask input
            this.$el.find('#birthday-item').mask('9999/99/99');

            console.log(this.model);
        }
    });

    return BirthDayItem;
});