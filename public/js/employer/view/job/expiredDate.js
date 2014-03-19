define([
    'common/view/item-base',
    'text!employer/template/job/expiredDate.html'
], function(
    BaseView,
    template) {

    var ExpiredDateItem = BaseView.extend({

        // template
        template: template,

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'input': 'input'
            });

            // update model when input value changed
            this.events = _.extend({}, this.events, {
                'change input': 'updateModel'
            });

            // listen on expiredDate property for save
            this.modelEvents = {
                'change:expiredDate': 'save'
            };
        },

        // after render
        onRender: function() {

            var self = this;

            // append data picker
            this.ui.input.datepicker({
                autoclose: true,
                startView: 2,
                startDate: new Date(),
                language: 'ja'
            });

            // enable mask input
            this.ui.input.mask('9999/99/99');

            // // bind validator
            // Backbone.Validation.bind(this);
        },

        onBeforeClose: function() {
            this.ui.input.datepicker('remove');
        },

        // reflect user input on model
        updateModel: function() {

            // clear all errors
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
                expiredDate: moment(this.ui.input.val()).toJSON()
            };
        },

        renderValue: function(data) {
            this.ui.value.text(moment(data.expiredDate).format('LL'));
        }

    });

    return ExpiredDateItem;
});