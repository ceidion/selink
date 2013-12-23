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

            var self = this;

            // append data picker
            this.$el.find('#birthday-item').datepicker({
                autoclose: true,
                language: 'ja'
            });

            // enable mask input
            this.$el.find('#birthday-item').mask('9999/99/99');

            this.$el.find('form').validate(_.extend({}, this.commonValidate, {

                rules: {
                    birthDay: {
                        dateISO: true
                    }
                },

                messages: {
                    birthDay: {
                        dateISO: "メールアドレスのフォーマットでご入力ください"
                    }
                },
                
                submitHandler: function (form) {
                    self.onSignIn();
                }
            }));
        },

        onSignIn: function() {
            console.log('update birthday');
        }
    });

    return BirthDayItem;
});