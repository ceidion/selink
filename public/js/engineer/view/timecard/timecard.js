define([
    'text!templates/timecard/timecard.html'
], function(template) {

    // PageView is the biggest frame of the application
    var TimeCardView = Backbone.Marionette.Layout.extend({

        // Template
        template: template,

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

            console.log(this.options.userId);

            /* initialize the external events
            -----------------------------------------------------------------*/
            $('#external-events div.external-event').each(function() {

                // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                // it doesn't need to have a start or end
                var eventObject = {
                    title: $.trim($(this).text()) // use the element's text as the event title
                };

                // store the Event Object in the DOM element so we can get to it later
                $(this).data('eventObject', eventObject);

                // make the event draggable using jQuery UI
                $(this).draggable({
                    zIndex: 999,
                    revert: true,      // will cause the event to go back to its
                    revertDuration: 0  //  original position after the drag
                });

            });

            /* initialize the calendar
            -----------------------------------------------------------------*/

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();


            var calendar = $('#calendar').fullCalendar({
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
                    '/user/' + this.options.userId + '/events'
                ],
                // drag and drop setting
                editable: true,
                droppable: true, // this allows things to be dropped onto the calendar !!!
                drop: function(date, allDay) { // this function is called when something is dropped

                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = $(this).data('eventObject');
                    var $extraEventClass = $(this).attr('data-class');


                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = $.extend({}, originalEventObject);

                    // assign it the date that was reported
                    copiedEventObject.start = date;
                    copiedEventObject.allDay = allDay;
                    if($extraEventClass) copiedEventObject['className'] = [$extraEventClass];

                    // render the event on the calendar
                    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                    $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

                    // is the "remove after drop" checkbox checked?
                    if ($('#drop-remove').is(':checked')) {
                        // if so, remove the element from the "Draggable Events" list
                        $(this).remove();
                    }

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
        },
    });

    return TimeCardView;
});