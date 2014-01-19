define([
    'common/view/item-base',
    'text!employer/template/job/price.html'
], function(
    BaseView,
    template) {

    var PriceItem = BaseView.extend({

        // template
        template: template,

        // icon
        icon: 'icon-jpy',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'input': 'input'
            });

            // update model when input value changed
            this.events = _.extend({}, this.events, {
                'change input': 'updateModel'
            });

            // listen on price property for save
            this.modelEvents = {
                'change:price': 'save'
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

        save: function() {

            if (this.model.isNew()) {
                this.collection.add(this.model.toJSON());
                // // this.model.save();
                // console.log(this.model.collection);
            }
        },

        getData: function() {
            return {
                price: this.ui.input.val()
            };
        },

        renderValue: function(data) {

            if (!data.price) {
                this.ui.value.html(this.placeholder);
                return;
            }

            this.ui.value.text(data.price);
        },

        successMsg: function(data) {

            if (!data.price)
                return "メールアドレスはクリアしました。";

            return "メールアドレスは「" + data.price + "」に更新しました。";
        }

    });

    return PriceItem;
});