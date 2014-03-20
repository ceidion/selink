define([
    'common/view/item-base',
    'text!employer/template/job/duration.html'
], function(
    BaseView,
    template) {

    return BaseView.extend({

        // template
        template: template,

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'startDate': 'input[name="startDate"]',
                'endDate': 'input[name="endDate"]'
            });

            // update model when input value changed
            this.events = _.extend({}, this.events, {
                'change input': 'updateModel'
            });

            // listen on startDate property for save
            this.modelEvents = {
                'change:startDate': 'save',
                'change:endDate': 'save',
            };
        },

        // after render
        onRender: function() {

            var self = this;

            // append data picker
            this.$el.find('input[name="startDate"], input[name="endDate"]')
            .datepicker({
                autoclose: true,
                startView: 2,
                startDate: new Date(),
                language: 'ja'
            });

            // enable mask input
            this.$el.find('input[name="startDate"], input[name="endDate"]')
            .mask('9999/99/99');

            // // bind validator
            // Backbone.Validation.bind(this);
        },

        onBeforeClose: function() {
            this.$el.find('input[name="startDate"], input[name="endDate"]').datepicker('remove');
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

            var data = {},
                startDateInput = this.ui.startDate.val(),
                endDateInput = this.ui.endDate.val();

            if (startDateInput) {
                data.startDate = moment(startDateInput).toJSON();
            }

            if (endDateInput) {
                data.endDate = moment(endDateInput).toJSON();
            }

            return data;
        },

        renderValue: function(data) {

            if (data.startDate && !data.endDate)
                this.ui.value.text(moment(data.startDate).format('LL') + "〜");
            else if (!data.startDate && data.endDate)
                this.ui.value.text("〜" + moment(data.endDate).format('LL'));
            else if (data.startDate && data.endDate)
                this.ui.value.text(moment(data.startDate).format('LL') + "〜" + moment(data.endDate).format('LL'));
            else
                this.ui.value.html(this.placeholder);
        }

    });
});