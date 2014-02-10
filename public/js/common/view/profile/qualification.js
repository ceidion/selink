define([
    'common/view/item-base',
    'text!common/template/profile/qualification.html'
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
                'dateValue': '#date-value',
                'nameValue': '#name-value',
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

        onBeforeClose: function() {
            this.ui.date.datepicker('remove');
        },

        updateModel: function() {

            // clear all errors
            this.clearError();

            var inputData = this.getData();

            // check input value
            var errors = this.model.preValidate(inputData);

            // if input has errors
            if (errors) {
                // show error
                this.showError(errors);
            } else {
                // set value on model
                this.model.set(inputData);
                this.renderValue(inputData);
            }
        },

        removeModel: function() {

            var self = this;

            this.$el.slBounceOut('', function(){
                $(this).removeClass('animated bounceOut');
                self.model.collection.remove(self.model);
            });
        },

        getData: function() {

            var acquireDate = this.ui.date.val() ? moment(this.ui.date.val()).toJSON() : "";

            return {
                name: this.ui.name.val(),
                acquireDate: acquireDate
            };
        },

        renderValue: function(data) {

            if (data.name)
                this.ui.nameValue.text(data.name);
            else
                this.ui.nameValue.html('<span class="text-muted">資格名称</span>');

            if (data.acquireDate)
                this.ui.dateValue.text(moment(data.acquireDate).format('YYYY年M月'));
            else
                this.ui.dateValue.html('<span class="text-muted">未入力</span>');
        }
    });

    return QualificationItem;
});