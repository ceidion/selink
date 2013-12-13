define([
    'text!templates/timecard/timecard.html'
], function(template) {

    // PageView is the biggest frame of the application
    var TimeCardView = Backbone.Marionette.Layout.extend({

        // Template
        template: template,

        // className: "container",

        // Events
        events: {
            // 'click #logoutBtn': 'onLogout',
            // 'click': 'onClick'
        },

        // Regions
        regions: {
            // header: '#header',
            // content: '#content',
            // footer: '#footer'
        },

        // Initializer
        initialize: function() {
            // for slide animation effect change the default
            // behavior of show view on content region
            // this.content.open = function(view) {
            //     this.$el.hide();
            //     this.$el.html(view.el);
            //     this.$el.fadeIn();
            // };
        },

        // After render
        onRender: function() {
            // this.listenTo(vent, 'logout:sessionTimeOut', this.doLogout);
        },

        // After show
        onShow: function() {
            /* initialize the calendar
            -----------------------------------------------------------------*/

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();


            var calendar = $('#calendar').fullCalendar({
                 buttonText: {
                    prev: '<i class="icon-chevron-left"></i>',
                    next: '<i class="icon-chevron-right"></i>'
                },

                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                events: [
                {
                    title: 'All Day Event',
                    start: new Date(y, m, 1),
                    className: 'label-important'
                },
                {
                    title: 'Long Event',
                    start: new Date(y, m, d-5),
                    end: new Date(y, m, d-2),
                    className: 'label-success'
                },
                {
                    title: 'Some Event',
                    start: new Date(y, m, d-3, 16, 0),
                    allDay: false
                }]
                ,
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

                }
                ,
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

                }
                ,
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