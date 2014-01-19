define([
    'common/view/item-base',
    'text!employer/template/job/duration.html'
], function(
    BaseView,
    template) {

    var DurationItem = BaseView.extend({

        // template
        template: template,

        // icon
        icon: 'icon-calendar',

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

            // bind validator
            Backbone.Validation.bind(this);
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

        save: function() {

            if (this.model.isNew()) {
                this.collection.add(this.model);
            }
        },

        getData: function() {
            return {
                startDate: moment(this.ui.startDate.val()).toJSON(),
                endDate: moment(this.ui.endDate.val()).toJSON()
            };
        },

        renderValue: function(data) {
            this.ui.value.text(moment(data.startDate).format('LL'));
        },

        successMsg: function(data) {
            return "生年月日は「" + moment(data.startDate).format('LL') + "」に更新しました。";
        }

    });

    return DurationItem;
});