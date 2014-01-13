define([
    'text!templates/case/index.html',
], function(template) {

    // PageView is the biggest frame of the application
    var IndexView = Backbone.Marionette.Layout.extend({

        // Template
        template: template,

        // ui
        ui: {
        },

        // Events
        events: {
        },

        collectionEvents: {
            // 'add': 'createEvent',
            // 'change': 'updateEvent',
            // 'remove': 'removeEvent',
        },

        // Regions
        regions: {
        },

        // Initializer
        initialize: function() {
        },

        // After render
        onRender: function() {
        },

        // After show
        onShow: function() {

        },

        createEvent: function(event) {

            var self = this;

            // safe the event
            this.collection.create(event, {

                // event saved successful
                success: function(model, response, options) {

                    // render the event(the response from server) on the calendar
                    // the last `true` argument determines if the event "sticks"
                    // (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                    self.ui.calendar.fullCalendar('renderEvent', response, true);
                    self.ui.eventModal.modal('hide');
                },
                // if error happend
                error: function(model, xhr, options) {

                }
            });
        },

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

        },

        adjustDateTime: function(date) {

            var dateClone = new Date(date);
            dateClone.setHours(dateClone.getHours() + 9);
            return dateClone;
        }
    });

    return IndexView;
});