define([
    'common/view/item-base',
    'text!common/template/profile/birthday.html'
], function(
    BaseView,
    template) {

    return BaseView.extend({

        // template
        template: template,

        className: 'row',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'input': 'input'
            });

            // update model when input value changed
            this.events = _.extend({}, this.events, {
                'change input': 'updateModel'
            });

            // listen on birthDay property for save
            this.modelEvents = {
                'change:birthDay': 'save'
            };
        },

        // after render
        onRender: function() {

            var self = this;

            // append data picker
            this.ui.input.datepicker({
                autoclose: true,
                forceParse: false,
                startView: 2,
                endDate: new Date(),
                language: 'ja'
            });

            // // enable mask input
            // this.ui.input.mask('9999/99/99', {
            //     completed: function() {
            //         console.log(this.val());
            //     }
            // });

            // bind validator
            Backbone.Validation.bind(this);
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
                birthDay: moment(this.ui.input.val()).toJSON()
            };
        },

        renderValue: function(data) {

            if (!data.birthDay) {
                this.ui.value.text(moment(data.birthDay).format('LL'));
            }
        }

    });
});