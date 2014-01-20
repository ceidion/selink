define([
    'common/view/item-base',
    'text!employer/template/job/price.html'
], function(
    BaseView,
    template) {

    var PriceItem = BaseView.extend({

        // template
        template: template,

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'priceTop': 'input[name="priceTop"]',
                'priceBottom': 'input[name="priceBottom"]'
            });

            // update model when input value changed
            this.events = _.extend({}, this.events, {
                'change input': 'updateModel'
            });

            // listen on price property for save
            this.modelEvents = {
                'change:priceTop': 'save',
                'change:priceBottom': 'save'
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

            var data = {};

            if (this.ui.priceTop.val()) {
                data.priceTop = this.ui.priceTop.val();
            }

            if (this.ui.priceBottom.val()) {
                data.priceBottom = this.ui.priceBottom.val();
            }

            return data;
        },

        renderValue: function(data) {

            if (data.priceTop && !data.priceBottom)
                this.ui.value.text("〜" + data.priceTop);
            else if (!data.priceTop && data.priceBottom)
                this.ui.value.text(data.priceBottom + "〜");
            else if (data.priceTop && data.priceBottom)
                this.ui.value.text(data.priceBottom + "〜" + data.priceTop);
            else
                this.ui.value.html(this.placeholder);
        }

    });

    return PriceItem;
});