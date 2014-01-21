define([
    'common/view/item-base',
    'text!common/template/profile/employment.html'
], function(
    BaseView,
    template) {

    var EmploymentItem = BaseView.extend({

        // template
        template: template,

        className: 'sl-editable',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'companyValue': '#company-value',
                'positionValue': '#position-value',
                'durationValue': '#duration-value',
                'addressValue': '#address-value',
                'company': 'input[name="company"]',
                'address': 'input[name="address"]',
                'position': 'input[name="position"]',
                'startDate': 'input[name="startDate"]',
                'endDate': 'input[name="endDate"]',
                'remove': '.btn-remove'
            });

            this.events = _.extend({}, this.events, {
                'change input[name="company"]': 'updateModel',
                'change input[name="address"]': 'updateModel',
                'change input[name="position"]': 'updateModel',
                'change input[name="startDate"]': 'updateModel',
                'change input[name="endDate"]': 'updateModel',
                'click .btn-remove': 'removeModel'
            });
        },

        // after render
        onRender: function() {

            // append data picker
            this.$el.find('input[name="startDate"],input[name="endDate"]').datepicker({
                autoclose: true,
                startView: 2,
                minViewMode: 1,
                endDate: new Date(),
                format: 'yyyy/mm',
                language: 'ja'
            });

            // enable mask input
            this.$el.find('input[name="startDate"],input[name="endDate"]').mask('9999/99');

            // ?? I did bind on collection....
            Backbone.Validation.bind(this);
        },

        onBeforeClose: function() {
           this.$el.find('input[name="startDate"],input[name="endDate"]').datepicker('remove');
        },

        updateModel: function() {

            // clear all errors
            this.clearError();

            var inputData = this.getData();

            // check input value
            var errors = this.model.preValidate(inputData) || {};

            // check wheter end date is after start date
            if (this.ui.startDate.val() && this.ui.endDate.val()) {

                // looks very bad, but work
                var startDate = new Date(this.ui.startDate.val()),
                    endDate = new Date(this.ui.endDate.val());

                if (moment(startDate).isAfter(endDate))
                    errors.endDate = errors.endTime = "開始日より後の時間をご入力ください";
            }

            // if input has errors
            if (!_.isEmpty(errors)) {
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

            this.$el
                .addClass('animated bounceOut')
                .one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd animationend', function() {
                    $(this).removeClass('animated bounceOut');
                    self.model.collection.remove(self.model);
                });
        },

        getData: function() {

            var startDate = this.ui.startDate.val() ? moment(this.ui.startDate.val()).toJSON() : "",
                endDate = this.ui.endDate.val() ? moment(this.ui.endDate.val()).toJSON() : "";

            return {
                company: this.ui.company.val(),
                address: this.ui.address.val(),
                position: this.ui.position.val(),
                startDate: startDate,
                endDate: endDate
            };
        },

        renderValue: function(data) {

            if (data.company)
                this.ui.companyValue.text(data.company);
            else
                this.ui.companyValue.html('<span class="text-muted">会社名</span>');

            if (data.position)
                this.ui.positionValue.html('<span class="label label-sm label-primary arrowed arrowed-right">' + data.position + '</span>');
            else
                this.ui.positionValue.empty();

            if (data.address)
                this.ui.addressValue.text(data.address);
            else
                this.ui.addressValue.empty();

            if (data.startDate && !data.endDate)
                this.ui.durationValue.text(moment(data.startDate).format('YYYY年M月') + "〜");
            else if (!data.startDate && data.endDate)
                this.ui.durationValue.text("〜" + moment(data.endDate).format('YYYY年M月'));
            else if (data.startDate && data.endDate)
                this.ui.durationValue.text(moment(data.startDate).format('YYYY年M月') + "〜" + moment(data.endDate).format('YYYY年M月'));
            else
                this.ui.durationValue.html('<span class="text-muted">未入力</span>');
        }
    });

    return EmploymentItem;
});