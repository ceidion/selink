define([
    'common/view/item-base',
    'text!common/template/resume/birthday.html'
], function(
    BaseView,
    template) {

    var BirthDayItem = BaseView.extend({

        // template
        template: template,

        // icon
        icon: 'icon-calendar',

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
                startView: 2,
                endDate: new Date(),
                language: 'ja'
            });

            // enable mask input
            this.ui.input.mask('9999/99/99');

            // bind validator
            Backbone.Validation.bind(this);
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
            this.ui.value.text(moment(data.birthDay).format('LL'));
        },

        successMsg: function(data) {
            return "生年月日は「" +　moment(data.birthDay).format('LL') + "」に更新しました。";
        }

    });

    return BirthDayItem;
});