define([
    'view/common/item-base',
    'text!template/resume/birthday.html'
], function(
    BaseView,
    template) {

    var BirthDayItem = BaseView.extend({

        // template
        template: template,

        // icon
        icon: 'icon-calendar',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'input': 'input'
            });

            this.events = _.extend({}, this.events, {
                'change input': 'submitForm'
            });
        },

        // after render
        onRender: function() {

            var self = this;

            // append data picker
            this.ui.input.datepicker({
                autoclose: true,
                startView: 2,
                endDate: new Date(),
                language: 'ja'
            });

            // enable mask input
            this.ui.input.mask('9999/99/99');

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
                birthDay: this.ui.input.val()
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