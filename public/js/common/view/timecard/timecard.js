define([
    'text!common/template/timecard/timecard.html',
    'common/view/timecard/record'
], function(template, RecordView) {

    var CalendarView = Backbone.Marionette.CompositeView.extend({

        // Template
        template: template,

        // for dnd add class here
        // className: 'widget-box transparent',

        // item view container
        itemViewContainer: 'tbody',

        // item view
        itemView: RecordView,

        // ui
        ui: {
        },

        // Events
        events: {
        },

        // Collection events
        collectionEvents: {
            'add': 'createEvent',
            'change': 'updateEvent',
            'remove': 'removeEvent',
        },

        // Initializer
        initialize: function() {

            var models = [];

            for (var i=1; i <= moment().endOf('month').date(); i++) {
                models.push({
                    start: moment().date(i),
                    end: moment().date(i)
                });
            }

            this.collection = new Backbone.Collection(models);
        },

        // After render
        onRender: function() {
            Backbone.Validation.bind(this);
        },

        // After show
        onShow: function() {
        },

        // create new event
        createEvent: function(event) {

            var self = this;

            // safe the event
            this.collection.create(event, {

                // event saved successful
                success: function(model, response, options) {

                },
                // if error happend
                error: function(model, xhr, options) {

                }
            });
        },

        // update event
        updateEvent: function(model) {

            if (model.isNew()) return;

            var self = this;

            // Save the model
            model.save(null , {

                // if save success
                success: function(model, response, options) {

                    var updatedEvent = self.ui.calendar.fullCalendar('clientEvents', function(event) {
                        if (event._id == model.get('_id'))
                            return true;
                    });

                    _.extend(updatedEvent[0], response);

                    self.ui.calendar.fullCalendar('updateEvent', updatedEvent[0]);
                    self.ui.eventModal.modal('hide');
                },

                // if other errors happend
                error: function(model, xhr, options) {

                    var error = $.parseJSON(xhr.responseText);

                    $.gritter.add({
                        title: error.title,
                        text: error.msg,
                        sticky: true,
                        class_name: 'gritter-error gritter-center',
                    });
                },

                // use patch
                patch: true
            });
        },

        // remove event
        removeEvent: function(model) {

            var self = this;

            model.destroy({
                success: function() {
                    self.ui.calendar.fullCalendar('removeEvents', function(event) {
                        if (event._id == model.get('_id'))
                            return true;
                    });
                    self.ui.eventModal.modal('hide');
                }
            });
        }

    });

    return CalendarView;
});