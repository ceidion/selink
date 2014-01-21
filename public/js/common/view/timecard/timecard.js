define([
    'text!common/template/timecard/timecard.html',
    // 'common/view/timecard/event'
], function(template, EventView) {

    var CalendarView = Backbone.Marionette.Layout.extend({

        // Template
        template: template,

        // ui
        ui: {
            defaultEvents: '#external-events div.external-event',
            calendar: '#calendar',
            eventModal: '#event-modal'
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

        // Regions
        regions: {
            'eventModal': '#event-modal'
        },

        // Initializer
        initialize: function() {
        },

        // After render
        onRender: function() {
            Backbone.Validation.bind(this);
        },

        // After show
        onShow: function() {

            this.initialDefaultEvent();
            this.initialCalendar();
        },

        // initialize the external events
        initialDefaultEvent: function() {

            this.ui.defaultEvents.each(function() {

                var $this = $(this);

                // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                // it doesn't need to have a start or end
                var eventObject = {
                    title: $.trim($this.text()), // use the element's text as the event title
                    className: $this.data('class'),
                    allDay: $this.data('allday'),
                    start: $this.data('start'),
                    end: $this.data('end')
                };

                // store the Event Object in the DOM element so we can get to it later
                $this.data('eventObject', eventObject);

                // make the event draggable using jQuery UI
                $this.draggable({
                    zIndex: 999,
                    revert: true,      // will cause the event to go back to its
                    revertDuration: 0  //  original position after the drag
                });

            });

        },

        // initialize the calendar
        initialCalendar: function() {

            var self = this;
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