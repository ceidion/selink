define([
    'common/view/item-base',
    'text!common/template/resume/email.html'
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

            // update model when input value changed
            this.events = _.extend({}, this.events, {
                'change input': 'updateModel'
            });

            // listen on email property for save
            this.modelEvents = {
                'change:email': 'save'
            };
        },

        // after render
        onRender: function() {
            // bind validator
            Backbone.Validation.bind(this);
        },

        // reflect user input on model
        updateModel: function() {

            // clear all error
            this.clearError();

            // check input value
            var errors = this.model.preValidate(this.getData());

            // if input has errors
            if (errors) {
                // show error
                this.showError(errors);
            } else {
                // set value on model
                this.model.set(this.getData());
            }
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