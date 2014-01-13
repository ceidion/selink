define([
    'view/common/item-base',
    'text!template/resume/name.html'
], function(
    BaseView,
    template) {

    var NameEditor = BaseView.extend({

        // template
        template: template,

        // icon
        icon: 'icon-user',

        placeholder: '氏名',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                firstName: 'input[name="firstName"]',
                lastName: 'input[name="lastName"]'
            });

            this.events = _.extend({}, this.events, {
                // Update model when input's value was chenaged
                'change input[name="firstName"]': 'submitForm',
                'change input[name="lastName"]': 'submitForm'
            });
        },

        // after render
        onRender: function() {

            // call super class method append validator
            BaseView.prototype.onRender.call(this, {

                // onfocusout: false,

                // onkeyup: false,

                rules: {
                    firstName: {
                        maxlength: 20
                    },
                    lastName: {
                        maxlength: 20
                    }
                },

                messages: {
                    firstName: {
                        maxlength: "20文字以内でご入力ください"
                    },
                    lastName: {
                        maxlength: "20文字以内でご入力ください"
                    }
                }
            });
        },

        submitForm: function() {
            this.$el.find('form').submit();
        },

        getData: function() {
            return {
                firstName: this.ui.firstName.val(),
                lastName: this.ui.lastName.val()
            };
        },

        renderValue: function(data) {

            if (!data.firstName && !data.lastName) {
                this.ui.value.html(this.placeholder);
                return;
            }

            this.ui.value.text(data.firstName + " " + data.lastName);
        },

        successMsg: function(data) {

            if (!data.firstName && !data.lastName)
                return "氏名はクリアしました。";

            return "氏名は「" + data.firstName + " " + data.lastName + "」に更新しました。";
        }
    });

    return NameEditor;
});