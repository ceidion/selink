define([
    'common/view/item-base',
    'text!employer/template/job/name.html'
], function(
    BaseView,
    template) {

    var JobNameItem = BaseView.extend({

        // template
        template: template,

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'input': 'input',
                'nameValue': '#name-value'
            });

            // update model when input value changed
            this.events = _.extend({}, this.events, {
                'change input': 'updateModel'
            });

            // listen on name property for save
            this.modelEvents = {
                'change:name': 'save'
            };
        },

        // // after render
        // onRender: function() {
        //     // bind validator
        //     Backbone.Validation.bind(this);
        // },

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
                name: this.ui.input.val()
            };
        },

        renderValue: function(data) {

            if (!data.name) {
                this.ui.value.html(this.placeholder);
                return;
            }

            this.ui.nameValue.text(data.name);
        }

    });

    return JobNameItem;
});