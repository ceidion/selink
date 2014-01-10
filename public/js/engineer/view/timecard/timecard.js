define([
    'text!templates/timecard/timecard.html'
], function(template) {

    // PageView is the biggest frame of the application
    var TimeCardView = Backbone.Marionette.Layout.extend({

        // Template
        template: template,

        // ui
        ui: {
            defaultEvents: '#external-events div.external-event',
            calendar: '#calendar'
        },

        // Events
        events: {
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

            this.initialDefaultEvent();
            this.initialTimeCard();
        },

        initialDefaultEvent: function() {

            /* initialize the external events
            -----------------------------------------------------------------*/
            this.ui.defaultEvents.each(function() {

                var $this = $(this);

                // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                // it doesn't need to have a start or end
                var eventObject = {
                    title: $.trim($this.text()), // use the element's text as the event title
                    className: $this.data('class'),
                    allDay: $this.data('allday'),
                    start: $this.data('start'),
                    end: $this.data('end'),
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

            this.ui.calendar.fullCalendar({
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
                    week: "yyyy年　MMM d日{ '&#8212;'[ MMM] d日}",
                    day: 'yyyy年 MMM d日 dddd'
                },
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
                dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
                // event setting
                eventSources: [
                    self.collection.toJSON()
                ],
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

                    // safe the event
                    self.collection.create(postEventObject, {

                        // event saved successful
                        success: function(model, response, options) {

                            // render the event(the response from server) on the calendar
                            // the last `true` argument determines if the event "sticks"
                            // (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                            self.ui.calendar.fullCalendar('renderEvent', response, true);
                        },
                        // if error happend
                        error: function(model, xhr, options) {

                        }
                    });
                },
                // selection setting
                selectable: true,
                selectHelper: true,
                select: function(start, end, allDay) {

                    bootbox.prompt("New Event Title:", function(title) {
                        if (title !== null) {
                            calendar.fullCalendar('renderEvent',
                                {
                                    title: title,
                                    start: start,
                                    end: end,
                                    allDay: allDay
                                },
                                true // make the event "stick"
                            );
                        }
                    });

                    calendar.fullCalendar('unselect');
                },
                eventClick: function(calEvent, jsEvent, view) {

                    var form = $("<form class='form-inline'><label>Change event name &nbsp;</label></form>");
                    form.append("<input class='middle' autocomplete=off type=text value='" + calEvent.title + "' /> ");
                    form.append("<button type='submit' class='btn btn-sm btn-success'><i class='icon-ok'></i> Save</button>");

                    var div = bootbox.dialog({
                        message: form,

                        buttons: {
                            "delete" : {
                                "label" : "<i class='icon-trash'></i> Delete Event",
                                "className" : "btn-sm btn-danger",
                                "callback": function() {
                                    calendar.fullCalendar('removeEvents' , function(ev){
                                        return (ev._id == calEvent._id);
                                    })
                                }
                            } ,
                            "close" : {
                                "label" : "<i class='icon-remove'></i> Close",
                                "className" : "btn-sm"
                            }
                        }

                    });

                    form.on('submit', function(){
                        calEvent.title = form.find("input[type=text]").val();
                        calendar.fullCalendar('updateEvent', calEvent);
                        div.modal("hide");
                        return false;
                    });


                    //console.log(calEvent.id);
                    //console.log(jsEvent);
                    //console.log(view);

                    // change the border color just for fun
                    //$(this).css('border-color', 'red');

                }

            });
        }
    });

    return TimeCardView;
});