define([
    'view/common/item-base',
    'text!template/resume/email.html'
], function(
    BaseView,
    template) {

    var EMailItem = BaseView.extend({

        // template
        template: template,

        // icon
        icon: 'icon-envelope-alt',

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

            // call super class method append validator
            BaseView.prototype.onRender.call(this, {

                onfocusout: false,

                onkeyup: false,

                rules: {
                    email: {
                        email: true
                    }
                },

                messages: {
                    email: {
                        email: "メールアドレスは正しいフォーマットでご入力ください"
                    }
                }
            });
        },

        submitForm: function() {
            this.$el.find('form').submit();
        },

        getData: function() {
            return {
                email: this.ui.input.val()
            };
        },

        renderValue: function(data) {

            if (!data.email) {
                this.ui.value.html(this.placeholder);
                return;
            }

            this.ui.value.text(data.email);
        },

        successMsg: function(data) {

            if (!data.email)
                return "メールアドレスはクリアしました。";

            return "メールアドレスは「" +　data.email + "」に更新しました。";
        }

    });

    return EMailItem;
});