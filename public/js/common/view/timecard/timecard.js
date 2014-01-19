define([
    'text!common/template/timecard/timecard.html',
    'common/view/timecard/event'
], function(template, EventView) {

    // PageView is the biggest frame of the application
    var TimeCardView = Backbone.Marionette.Layout.extend({

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
            this.initialTimeCard();
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
        initialTimeCard: function() {

            var self = this;

            var calendar = this.ui.calendar.fullCalendar({
                // basic setting & localize
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                buttonText: {
                    prev: '<i class="icon-chevron-left"></i>',
                    next: '<i class="icon-chevron-right"></i>',
                    today: '本日',
                    month: '月',
                    week: '週',
                    day: '日'
                },
                titleFormat: {
                    month: 'yyyy年 MMMM',
                    week: "yyyy年 MMM d日{ '&#8212;'[ MMM] d日}",
                    day: 'yyyy年 MMM d日 dddd'
                },
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
                dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
                allDayText: '終日',
                // event setting
                events: {
                    url: 'https://www.google.com/calendar/feeds/ja.japanese%23holiday%40group.v.calendar.google.com/public/basic',
                    className: 'gcal-event',           // an option!
                    currentTimezone: 'America/Chicago' // an option!
                },
                eventSources: [
                    self.collection.toJSON()
                ],
                // event rendering
                eventRender: function(event, element, view) {

                    if (view.name != 'month') {
                        var $memo = $('<div class="sl-event-memo">').html(event.memo);
                        $memo.appendTo(element.find('.fc-event-inner'));
                    }

                },
                // drag and drop setting
                editable: true,
                droppable: true, // this allows things to be dropped onto the calendar !!!
                drop: function(date, allDay) { // this function is called when something is dropped

                    // retrieve the dropped element's stored Event Object
                    var eventObject = $(this).data('eventObject');

                    // we need a copy of event object, because JSON.stringify will change the start/end time
                    // we will adjust the time in this object for save it on server
                    var postEventObject = $.extend({}, eventObject);

                    // setup start and end time
                    var startDateTime = new Date(date),
                        endDateTime = new Date(date),
                        startTime = postEventObject.start ? postEventObject.start.split(':') : ["0","0"],
                        endTime = postEventObject.end ? postEventObject.end.split(':') : ["0","0"];

                    // JSON.stringify() will convert all date to UTC which is 9 hours later than Japan, I add it here
                    // better: date.setHours(date.getHours() - date.getTimezoneOffset()/60);
                    // This lost internationalization, but have to do this
                    startDateTime.setHours(Number(startTime[0]) + 9);
                    startDateTime.setMinutes(startTime[1]);
                    postEventObject.start = startDateTime;

                    endDateTime.setHours(Number(endTime[0]) + 9);
                    endDateTime.setMinutes(endTime[1]);
                    postEventObject.end = endDateTime;

                    // create the event
                    self.collection.add(postEventObject);
                },
                eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc) {

                    self.collection.get(event._id).set({
                        start: self.adjustDateTime(event.start),
                        end: self.adjustDateTime(event.end)
                    });
                },
                eventResize:function(event, dayDelta, minuteDelta, revertFunc) {

                    self.collection.get(event._id).set({
                        start: self.adjustDateTime(event.start),
                        end: self.adjustDateTime(event.end)
                    });
                },
                // selection setting
                selectable: true,
                selectHelper: true,
                select: function(start, end, allDay) {

                    // create a event editor modal, pass it the event collection
                    var eventModal = new EventView({
                        model: new self.collection.model({
                            start: moment(self.adjustDateTime(start)).toJSON()
                        }),
                        collection: self.collection
                    });

                    // add modal to page
                    self.eventModal.show(eventModal);

                    // show modal
                    self.ui.eventModal.modal('show');

                    calendar.fullCalendar('unselect');
                },
                eventClick: function(event, jsEvent, view) {

                    // create a event modal with selected event
                    var eventModal = new EventView({
                        model: self.collection.get(event._id),
                        collection: self.collection
                    });

                    // add modal to page
                    self.eventModal.show(eventModal);

                    // show modal
                    self.ui.eventModal.modal('show');
                }

            });
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

    return TimeCardView;
});