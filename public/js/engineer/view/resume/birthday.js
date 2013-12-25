define([
    'view/common/item-base',
    'text!template/resume/birthday.html'
], function(
    BaseView,
    template) {

    var BirthDayItem = BaseView.extend({

        // template
        template: template,

        // initializer
        initialize: function() {

            this.events = _.extend({}, this.events, {
                'change #birthday-item': 'submitForm'
            });
        },

        // after render
        onRender: function() {

            var self = this;

            // append data picker
            this.$el.find('#birthday-item').datepicker({
                autoclose: true,
                language: 'ja'
            });

            // enable mask input
            this.$el.find('#birthday-item').mask('9999/99/99');

            // call super class method append validator
            BaseView.prototype.onRender.call(this, {

                onfocusout: false,

                onkeyup: false,

                rules: {
                    birthDay: {
                        dateJa: true
                    }
                }
            });
        },

        submitForm: function() {
            this.$el.find('form').submit();
        },

        getData: function() {
            return {
                birthDay: this.$el.find('input').val()
            };
        },

        renderValue: function(data) {
            this.ui.value.text(moment(data.birthDay).format('LL'));
        },

        successMsg: function(data) {
            return "生年月日は「" +　moment(data.birthDay).format('LL') + "」に更新しました。";
        }

    });

    return BirthDayItem;
});