define([
    'common/view/composite-base',
    'text!admin/template/data/skill/skills.html',
    'admin/view/data/skill/skill',
    'common/collection/tags'
], function(
    BaseView,
    template,
    ItemView,
    TagsModel
) {

    var IndexView = BaseView.extend({

        // Template
        template: template,

        // item view container
        itemViewContainer: '.tag-container',

        // item view
        itemView: ItemView,

        // ui
        ui: {
            'stack': '#stack'
        },

        // Events
        events: {
            'click #stack': 'getStack'
        },

        collectionEvents: {
            'sync': 'reIsotope',
            // 'add': 'createEvent',
            // 'change': 'updateEvent',
            // 'remove': 'removeEvent',
        },

        count: 1,

        // Initializer
        initialize: function() {

            this.collection = new TagsModel();
            this.collection.fetch();
        },

        // After render
        onRender: function() {
        },

        // After show
        onShow: function() {
            // $('.tag-container').isotope({
            //   // options
            //   itemSelector : '.sl-tag'
            // });
        },

        reIsotope: function() {
            $('.tag-container').isotope({
              // options
              itemSelector : '.widget-container-span'
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
        },

        getStack: function getStack() {
            var self = this;
            $.ajax({
                type: 'GET',
                url: 'http://api.stackexchange.com/2.1/tags',
                data: {
                    pagesize: 100,
                    page: self.count,
                    order: 'desc',
                    sort: 'popular',
                    site: 'stackoverflow'
                },
                // use json format
                dataType: 'jsonp',

                jsonp: 'jsonp',
                success: function(data) {
                    self.saveStack(data);
                    if (data.has_more) {
                        self.count++;
                        console.log(self.count);
                        setTimeout(self.getStack(), 1000);
                    }
                },
                error: function() {
                    console.log('suck');
                }
            });
        },

        saveStack: function(data) {
            $.ajax({
                type: 'POST',
                url: '/stack',
                data: {tag : data.items},
                // use json format
                dataType: 'json',
                success: function(data) {

                },
                error: function() {
                    console.log('suck');
                }
            });
        }
    });

    return IndexView;
});