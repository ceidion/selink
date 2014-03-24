define([
    'text!employer/template/job/edit.html',
    'common/view/profile/languages',
    'common/view/profile/skills',
    'common/model/job'
], function(
    template,
    LanguageComposite,
    SkillComposite,
    JobModel
) {

    return Backbone.Marionette.Layout.extend({

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

        regions: {
            languageRegion: '#languages',
            skillRegion: '#skills',
        },

        events: {
            'click .btn-save': 'onSave'
        },

        // initializer
        initialize: function() {

            if (!this.model) {
                this.model = new JobModel();
                this.model.colleciton = this.collection;
            }

            this.languageComposite = new LanguageComposite({model: this.model});
            this.skillComposite = new SkillComposite({model: this.model});
        },

        // after render
        onRender: function() {

            this.languageRegion.show(this.languageComposite);
            this.skillRegion.show(this.skillComposite);

            // append data picker
            this.ui.expiredDate.datepicker({
                autoclose: true,
                forceParse: false,
                startDate: new Date(),
                language: 'ja'
            });

            this.$el.find('#duration').datepicker({
                autoclose: true,
                forceParse: false,
                startDate: new Date(),
                language: 'ja'
            });

            // append input mask
            this.ui.priceBottom.mask('9?99万円');
            this.ui.priceTop.mask('9?99万円');
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
                this.model.set(this.getInputData());

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

            console.log(this.getInputData());

            // check input
            var errors = this.model.preValidate(this.getInputData()) || {};

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
        },

        getInputData: function() {
            return {
                name: this.ui.name.val(),
                address: this.ui.address.val(),
                expiredDate: this.ui.expiredDate.val(),
                startDate: this.ui.startDate.val(),
                endDate: this.ui.endDate.val(),
                priceBottom: this.ui.priceBottom.val().replace('万円'),
                priceTop: this.ui.priceTop.val().replace('万円'),
                recruitNum: this.ui.recruitNum.val().replace('人'),
                interviewNum: this.ui.interviewNum.val().replace('回'),
                nativesOnly: this.ui.nativesOnly.val(),
                remark: this.ui.remark.html(),
            }
        }

    });
});