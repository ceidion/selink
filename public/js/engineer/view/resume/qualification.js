define([
    'view/common/item-base',
    'text!template/resume/qualification.html'
], function(
    BaseView,
    template) {

    var QualificationItem = BaseView.extend({

        // template
        template: template,

        className: 'sl-editable',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'date': 'input[name="acquireDate"]',
                'name': 'input[name="name"]',
                'remove': '.btn-remove'
            });

            this.events = _.extend({}, this.events, {
                'change input[name="acquireDate"]': 'updateModel',
                'change input[name="name"]': 'updateModel',
                'click .btn-remove': 'removeModel'
            });
        },

        // after render
        onRender: function() {

            // append data picker
            this.ui.date.datepicker({
                autoclose: true,
                startView: 2,
                minViewMode: 1,
                endDate: new Date(),
                format: 'yyyy/mm',
                language: 'ja'
            });

            // enable mask input
            this.ui.date.mask('9999/99');

            // ?? I did bind on collection....
            Backbone.Validation.bind(this);
        },

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

        removeModel: function() {

            var self = this;

            this.$el.addClass('animated bounceOut');
            this.$el.one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd animationend', function() {
                $(this).removeClass('animated bounceOut');
                self.model.collection.remove(self.model);
            });
        },

        getData: function() {
            return {
                name: this.ui.name.val(),
                acquireDate: this.ui.date.val()
            };
        }
    });

    return QualificationItem;
});