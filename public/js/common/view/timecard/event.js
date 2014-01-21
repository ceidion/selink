define([
    'common/view/item-base',
    'text!common/template/timecard/event.html'
], function(
    BaseView,
    template) {

    var labelList = [
        'primary',
        'info',
        'success',
        'purple',
        'danger',
        'pink',
        'warning',
        'yellow'
    ];

    var EventItem = BaseView.extend({

        // template
        template: template,

        // this view is a modal dialog
        className: 'modal-dialog',

        // initializer
        initialize: function() {

            // these properties are for display, we set them silently(won't trigger event)
            if (this.model.has('start')) {
                this.model.set('startDate', moment(this.model.get('start')).format('YYYY/MM/DD'), {silent: true});
                this.model.set('startTime', moment(this.model.get('start')).format('HH:mm'), {silent: true});
            }

            if (this.model.has('end')) {
                this.model.set('endDate', moment(this.model.get('end')).format('YYYY/MM/DD'), {silent: true});
                this.model.set('endTime', moment(this.model.get('end')).format('HH:mm'), {silent: true});
            }

            this.model.set('labels', labelList, {silent: true});

            this.ui = _.extend({}, this.ui, {
                'title': 'input[name="title"]',
                'allDay': 'input[name="allDay"]',
                'startDate': 'input[name="startDate"]',
                'startTime': 'input[name="startTime"]',
                'endDate': 'input[name="endDate"]',
                'endTime': 'input[name="endTime"]',
                'memo': '.wysiwyg-editor',
                'removeBtn': '.btn-remove',
                'saveBtn': '.btn-save'
            });

            this.events = _.extend({}, this.events, {
                'change input[name="allDay"]': 'setAllDay',
                'click .btn-save': 'saveEvent',
                'click .btn-remove': 'removeEvent'
            });
        },

        // after render
        onRender: function() {

            // initiate wysiwyg eidtor for memo
            this.ui.memo.ace_wysiwyg({
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

            // append data picker
            this.$el.find('input[name="startDate"],input[name="endDate"]').datepicker({
                // autoclose: true,
                format: 'yyyy/mm/dd',
                clearBtn: true,
                todayBtn: 'linked',
                language: 'ja'
            });

            // append time picker
            this.$el.find('input[name="startTime"],input[name="endTime"]').timepicker({
                minuteStep: 5,
                showMeridian: false,
                defaultTime: false
            });

            // enable mask input
            this.$el.find('input[name="startDate"],input[name="endDate"]').mask('9999/99/99');
            this.$el.find('input[name="startTime"],input[name="endTime"]').mask('99:99');

            // set all-day display
            this.setAllDay();

            // if this is a new event
            if (this.model.isNew())
                // bind validation on it (already exists event are binded on collecion)
                Backbone.Validation.bind(this);
        },

        onBeforeClose: function() {
           this.$el.find('input[name="startDate"],input[name="endDate"]').datepicker('remove');
        },

        // set input status according all-day attribute
        setAllDay: function() {

            // if event is an all-day event, disable the time input
            $dateInput = this.$el.find('input[name="startTime"],input[name="endTime"]');

            if (this.ui.allDay.is(':checked')) {
                $dateInput.attr('disabled', 'disabled');
            } else {
                $dateInput.prop('disabled', false);
            }
        },

        // save event
        saveEvent: function() {

            // if input value checking ok
            if (this.inputValid()) {

                // produce start/end datetime
                var startDate = new Date(this.ui.startDate.val()),
                    endDate = new Date(this.ui.endDate.val()),
                    startTime = this.ui.startTime.val() ? this.ui.startTime.val().split(':') : ["0","0"],
                    endTime = this.ui.endTime.val() ? this.ui.endTime.val().split(':') : ["0","0"];

                startDate.setHours(Number(startTime[0]));
                startDate.setMinutes(Number(startTime[1]));
                endDate.setHours(Number(endTime[0]));
                endDate.setMinutes(Number(endTime[1]));

                // produce allDay value
                var allDay = this.ui.allDay.is(':checked') ? true : false;

                // set value to model
                this.model.set({
                    title: this.ui.title.val(),
                    className: this.$el.find('input[name="label"]:checked').val(),
                    allDay: allDay,
                    start: startDate,
                    end: endDate,
                    memo: this.ui.memo.html()
                });

                // if this model is a new event
                if (this.model.isNew()) {
                    // add it to eventcollection
                    this.collection.add(this.model.toJSON());
                }
            }
        },

        // remove event
        removeEvent: function() {
            this.collection.remove(this.model);
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
                title: this.ui.title.val(),
                startDate: this.ui.startDate.val(),
                endDate: this.ui.endDate.val(),
            }) || {};

            // check wheter end date is after start date
            if (this.ui.startDate.val() && this.ui.endDate.val()) {

                // looks very bad, but work
                var startDate = new Date(this.ui.startDate.val()),
                    endDate = new Date(this.ui.endDate.val()),
                    startTime = this.ui.startTime.val() ? this.ui.startTime.val().split(':') : ["0","0"],
                    endTime = this.ui.endTime.val() ? this.ui.endTime.val().split(':') : ["0","0"];

                startDate.setHours(Number(startTime[0]));
                startDate.setMinutes(Number(startTime[1]));
                endDate.setHours(Number(endTime[0]));
                endDate.setMinutes(Number(endTime[1]));

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

    return EventItem;
});