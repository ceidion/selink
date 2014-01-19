define([
    'common/view/item-base',
    'text!employer/template/job/address.html'
], function(
    BaseView,
    template) {

    var AddressItem = BaseView.extend({

        // template
        template: template,

        // icon
        icon: 'icon-building',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'input': 'input'
            });

            // update model when input value changed
            this.events = _.extend({}, this.events, {
                'change input': 'updateModel'
            });

            // listen on address property for save
            this.modelEvents = {
                'change:address': 'save'
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
                this.renderValue(this.getData());
            }
        },

        save: function() {

            if (this.model.isNew()) {
                this.collection.add(this.model);
            }
        },

        getData: function() {
            return {
                address: this.ui.input.val()
            };
        },

        renderValue: function(data) {

            if (!data.address) {
                this.ui.value.html(this.placeholder);
                return;
            }

            this.ui.value.text(data.address);
        },

        successMsg: function(data) {

            if (!data.address)
                return "メールアドレスはクリアしました。";

            return "メールアドレスは「" + data.address + "」に更新しました。";
        }

    });

    return AddressItem;
});