define([
    'text!common/template/calendar/main.html',
    'common/collection/base',
    'common/model/event',
    'common/view/calendar/event'
], function(
    template,
    BaseCollection,
    EventModel,
    EventView
) {

    var Events = BaseCollection.extend({

        model: EventModel,

        url:  '/events',

        comparator: function(event) {
            // sort by start desc
            return Number(event.get('start').valueOf());
        }
    });

    return Backbone.Marionette.Layout.extend({

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
            // 'add': 'createEvent',
            // 'change': 'updateEvent',
            'remove': 'removeEvent',
        },

        // Regions
        regions: {
            'eventModal': '#event-modal'
        },

        // Initializer
        initialize: function() {

            // create events model(collection) from user model
            this.collection = new Events();
        },

        // After render
        onRender: function() {
            Backbone.Validation.bind(this);
        },

        // After show
        onShow: function() {

            var self = this;

            this.collection.fetch({
                success: function() {
                    self.initialDefaultEvent();
                    self.initialCalendar();
                    self.listenTo(self.collection, 'change', self.updateEvent);
                    self.listenTo(self.collection, 'add', self.createEvent);
                }
            });
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

            // config calendar
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
                // this function is called when something is dropped
                drop: function(date, allDay) {

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

                    startDateTime.setHours(startTime[0]);
                    startDateTime.setMinutes(startTime[1]);
                    postEventObject.start = startDateTime;

                    endDateTime.setHours(endTime[0]);
                    endDateTime.setMinutes(endTime[1]);
                    postEventObject.end = endDateTime;

                    postEventObject.allDay = allDay;

                    // create the event
                    self.collection.add(postEventObject);
                },
                // when event was moved to another place
                eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc) {

                    // find the event in collection and reset the datetime
                    self.collection.get(event._id).set({
                        allDay: allDay,
                        start: event.start,
                        end: event.end
                    });
                },
                // when event dragged to expand
                eventResize:function(event, dayDelta, minuteDelta, revertFunc) {

                    // find the event in collection and reset the datetime
                    self.collection.get(event._id).set({
                        start: event.start,
                        end: event.end
                    });
                },
                // selection setting
                selectable: true,
                selectHelper: true,
                // when the calendar date was selected
                select: function(start, end, allDay) {

                    // create a event editor modal, pass it the event collection
                    var eventModal = new EventView({
                        model: new self.collection.model({
                            allDay: allDay,
                            start: start
                        }),
                        collection: self.collection
                    });

                    // add modal to page
                    self.eventModal.show(eventModal);

                    // show modal
                    self.ui.eventModal.modal('show');

                    calendar.fullCalendar('unselect');
                },
                // when event was clicked
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

        // create new event
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

                },
                silent: true
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
});