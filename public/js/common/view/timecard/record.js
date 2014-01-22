define([
    'common/view/item-base',
    'text!common/template/timecard/record.html'
], function(
    BaseView,
    template) {

    var EventItem = BaseView.extend({

        // template
        template: template,

        tagName: 'tr',

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

            // append time picker
            this.$el.find('input[name="startTime"],input[name="endTime"]').timepicker({
                minuteStep: 5,
                showMeridian: false,
                defaultTime: false
            });

            // enable mask input
            this.$el.find('input[name="startTime"],input[name="endTime"]').mask('99:99');
        },

        onBeforeClose: function() {
           // this.$el.find('input[name="startDate"],input[name="endDate"]').datepicker('remove');
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