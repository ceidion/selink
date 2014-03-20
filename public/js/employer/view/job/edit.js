define([
    'text!employer/template/job/edit.html',
    // 'employer/view/job/name',
    // 'employer/view/job/address',
    // 'employer/view/job/expiredDate',
    // 'employer/view/job/duration',
    // 'employer/view/job/price',
    // 'employer/view/job/recruit',
    // 'employer/view/job/interview',
    // 'employer/view/job/native',
    // 'employer/view/job/remark',
    'common/model/job'
], function(
    template,
    // NameView,
    // AddressView,
    // ExpiredDateView,
    // DurationView,
    // PriceView,
    // RecruitView,
    // InterviewView,
    // NativeView,
    // RemarkView,
    JobModel
) {

    return Backbone.Marionette.ItemView.extend({

        // template
        template: template,

        // this view is a modal dialog
        className: 'modal-dialog',

        ui: {
            'name': 'input[name="name"]',
            'address': 'input[name="address"]',
            'expiredDate': 'input[name="expiredDate"]',
            'startDate': 'input[name="startDate"]',
            'endDate': 'input[name="endDate"]',
            'priceBottom': 'input[name="priceBottom"]',
            'priceTop': 'input[name="priceTop"]',
            'recruitNum': 'input[name="recruitNum"]',
            'interviewNum': 'input[name="interviewNum"]',
            'nativesOnly': 'input[name="nativesOnly"]',
            'remark': '.wysiwyg-editor'
        },

        events: {
            'click .btn-save': 'onSave'
        },

        // initializer
        initialize: function() {
            this.model = new JobModel();
            this.model.colleciton = this.collection;
        },

        // after render
        onRender: function() {

            // append data picker
            this.ui.expiredDate.datepicker({
                autoclose: true,
                forceParse: false,
                startDate: new Date(),
                language: 'ja'
            });

            this.$el.find('.input-daterange').datepicker({
                autoclose: true,
                forceParse: false,
                startDate: new Date(),
                language: 'ja'
            });

            // append input mask
            this.ui.priceBottom.mask('999万円');
            this.ui.priceTop.mask('999万円');
            this.ui.recruitNum.mask('9?9人');
            this.ui.interviewNum.mask('9?9回');

            // enable wysiwyg editor
            this.ui.remark.ace_wysiwyg({
                toolbar:
                [
                    'font',
                    null,
                    'fontSize',
                    null,
                    {name:'bold', className:'btn-info'},
                    {name:'italic', className:'btn-info'},
                    {name:'strikethrough', className:'btn-info'},
                    {name:'underline', className:'btn-info'},
                    null,
                    {name:'insertunorderedlist', className:'btn-success'},
                    {name:'insertorderedlist', className:'btn-success'},
                    {name:'outdent', className:'btn-purple'},
                    {name:'indent', className:'btn-purple'},
                    null,
                    {name:'justifyleft', className:'btn-primary'},
                    {name:'justifycenter', className:'btn-primary'},
                    {name:'justifyright', className:'btn-primary'},
                    {name:'justifyfull', className:'btn-inverse'},
                    null,
                    {name:'createLink', className:'btn-pink'},
                    {name:'unlink', className:'btn-pink'},
                    null,
                    {name:'insertImage', className:'btn-success'},
                    null,
                    'foreColor',
                    null,
                    {name:'undo', className:'btn-grey'},
                    {name:'redo', className:'btn-grey'}
                ],
                'wysiwyg': {
                    // fileUploadError: showErrorAlert
                }
            }).prev().addClass('wysiwyg-style3');

            // bind validator
            Backbone.Validation.bind(this);
        },

        onSave: function() {

            // if input value checking ok
            if (this.inputValid()) {

                // set value to model
                this.model.set({
                    name: this.ui.name.val(),
                    address: this.ui.address.val(),
                    expiredDate: this.ui.expiredDate.val(),
                    startDate: this.ui.startDate.val(),
                    endDate: this.ui.endDate.val(),
                });

                // if this model is a new event
                if (this.model.isNew()) {
                    // add it to eventcollection
                    this.collection.add(this.model.toJSON());
                }
            }
        },

        // checking input value
        inputValid: function() {

            // remove all error
            this.$el.find('input')
                .removeClass('tooltip-error').tooltip('destroy')
                .closest('.form-group').removeClass('has-error')
                .find('i').removeClass('animated-input-error');

            // check input
            var errors = this.model.preValidate({
                name: this.ui.name.val(),
                address: this.ui.address.val(),
                expiredDate: this.ui.expiredDate.val(),
                startDate: this.ui.startDate.val(),
                endDate: this.ui.endDate.val(),
            }) || {};

            // check wheter end date is after start date
            if (this.ui.startDate.val() && this.ui.endDate.val()) {

                // looks very bad, but work
                var startDate = new Date(this.ui.startDate.val()),
                    endDate = new Date(this.ui.endDate.val());

                if (moment(startDate).isAfter(endDate))
                    errors.endDate = errors.endTime = "開始日より後の時間をご入力ください";
            }

            // if got input error
            if (!_.isEmpty(errors)) {

                // append error message for every input
                for(var key in errors) {
                    this.$el.find('input[name="' + key + '"]')
                    .addClass('tooltip-error').tooltip({
                        placement: 'bottom',
                        title: errors[key]
                    })
                    .closest('.form-group').addClass('has-error')
                    .find('i').addClass('animated-input-error');
                }

                // return not valid
                return false;
            } else {
                // return valid
                return true;
            }
        }

    });
});