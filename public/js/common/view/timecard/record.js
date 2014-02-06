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
                'startTime': 'input[name="startTime"]',
                'endTime': 'input[name="endTime"]',
                'excludeTime': 'input[name="excludeTime"]',
                'fee': 'input[name="fee"]',
                'memo': 'input[name="memo"]',
                'removeBtn': '.btn-remove'
            });

            this.events = _.extend({}, this.events, {
                'click': 'createEvent',
                'change input': 'updateModel',
                'click .btn-remove': 'removeModel'
            });
        },

        // after render
        onRender: function() {

            // ?? I did bind on collection....
            Backbone.Validation.bind(this);

            // high light Saturday and Sunday
            var dayOfWeek = moment(this.model.get('start')).day();

            if (dayOfWeek === 6) {
                this.$el.addClass('warning');
            } else if (dayOfWeek === 0) {
                this.$el.addClass('success');
            }

            // setup timepicker will set the input field (don't know why), that will fire change event,
            // so I have to stop event delegate temprarly
            this.undelegateEvents();

            // append time picker
            this.$el.find('input[name="startTime"],input[name="endTime"],input[name="excludeTime"]').timepicker({
                minuteStep: 5,
                showMeridian: false,
                defaultTime: false
            });

            // enable event delegate again
            this.delegateEvents();

            // enable mask input
            this.$el.find('input[name="startTime"],input[name="endTime"],input[name="excludeTime"]').mask('99:99');
        },

        // create event, when user click on one row in the table, create 'go to work' event
        createEvent: function() {

            var self = this;

            // if this model is a new event
            if (this.model.isNew()) {
                this.model.save(null, {
                    success: function() {

                        self.ui.value.fadeOut('fast', function() {
                            // slideDown edit panel
                            self.ui.editor.slideDown('fast');
                            // mark this editor as opened
                            self.$el.addClass('sl-editor-open');

                            self.renderValue(self.model.toJSON());
                        });
                    }
                });
            } else
                // use the base version action
                BaseView.prototype.switchToEditor.apply(this);
        },

        // update event
        updateModel: function() {

            // clear all errors
            this.clearError();

            var inputData = this.getData();

            // check input
            var errors = this.model.preValidate(inputData) || {};

            // check wheter end time is after start time
            if (moment(inputData.start).isAfter(inputData.end))
                errors.endDate = errors.endTime = "開始日より後の時間をご入力ください";

            // if got input error
            if (!_.isEmpty(errors)) {
                // show error
                this.showError(errors);
            } else {
                // set value to model
                this.model.set(inputData);
                this.renderValue(inputData);
            }
        },

        removeModel: function() {
            this.model.destroy({
                success: function() {

                }
            });
        },

        getData: function() {

            // looks bad, but work
            var startDate = new Date(this.model.get('start')),
                endDate = new Date(this.model.get('end')),
                startTime = this.ui.startTime.val() ? this.ui.startTime.val().split(':') : ["0","0"],
                endTime = this.ui.endTime.val() ? this.ui.endTime.val().split(':') : ["0","0"];

            startDate.setHours(Number(startTime[0]));
            startDate.setMinutes(Number(startTime[1]));
            endDate.setHours(Number(endTime[0]));
            endDate.setMinutes(Number(endTime[1]));

            var data = {
                start: startDate,
                end: endDate,
            };

            if (this.ui.excludeTime.val())
                data.exclude = this.ui.excludeTime.val();

            if (this.ui.fee.val())
                data.fee = Number(this.ui.fee.val());

            if (this.ui.memo.val())
                data.memo = this.ui.memo.val();

            return data;
        },

        renderValue: function(data) {

            this.$el.find('#startTime').text(moment(data.start).format('HH:mm'));
            this.$el.find('#endTime').text(moment(data.end).format('HH:mm'));
            this.$el.find('#excludeTime').text(data.exclude);
            this.$el.find('#fee').text(data.fee);
            this.$el.find('#memo').text(data.memo);
            this.ui.removeBtn.removeClass('hide');
        }
    });

    return EventItem;
});