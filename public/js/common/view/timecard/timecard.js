define([
    'text!common/template/timecard/timecard.html',
    'common/collection/events',
    'common/view/timecard/record'
], function(template, EventsModel, RecordView) {

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
            'click': 'closeEditor'
        },

        // Collection events
        collectionEvents: {
            'add': 'createEvent',
            'change': 'updateEvent',
            'remove': 'removeEvent',
        },

        // Initializer
        initialize: function() {

            // here is tricky
            // make a empty array to create collection
            var models = [],
                i = 1;

            // loop through current month
            for (; i <= moment().endOf('month').date(); i++) {

                // get a single day
                var date = moment().date(i),
                    needSlot = true,
                    j = 0;

                // let the single day loop through the collection
                for (; j < this.collection.length; j++) {

                    // get a item of collection
                    var event = this.collection.at(j);

                    // if that single day and the item are same day and the item is "go to job"
                    if (moment(date).isSame(event.get('start'), 'day') && event.get('title') == "出勤") {
                        // let the collection item be a member of real collection
                        models.push(event);
                        // tell below no need to produce slot
                        needSlot = false;
                        break;
                    }
                }

                // if we need a slot, push the single empty day
                if (needSlot)
                    models.push({
                        start: date,
                        end: date
                    });
            }

            // create the real collection
            this.collection = new EventsModel(models);

            console.log(this.collection);
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
        },

        // profile view handle the click event
        // -- switch component in editor mode to value mode
        // *from x-editable*
        closeEditor: function(e) {
            var $target = $(e.target), i,
                exclude_classes = ['.editable-container',
                                   '.ui-datepicker-header',
                                   '.datepicker', //in inline mode datepicker is rendered into body
                                   '.modal-backdrop',
                                   '.bootstrap-wysihtml5-insert-image-modal',
                                   '.bootstrap-wysihtml5-insert-link-modal'
                                   ];

            //check if element is detached. It occurs when clicking in bootstrap datepicker
            if (!$.contains(document.documentElement, e.target)) {
              return;
            }

            //for some reason FF 20 generates extra event (click) in select2 widget with e.target = document
            //we need to filter it via construction below. See https://github.com/vitalets/x-editable/issues/199
            //Possibly related to http://stackoverflow.com/questions/10119793/why-does-firefox-react-differently-from-webkit-and-ie-to-click-event-on-selec
            if($target.is(document)) {
               return;
            }

            //if click inside one of exclude classes --> no nothing
            for(i=0; i<exclude_classes.length; i++) {
                 if($target.is(exclude_classes[i]) || $target.parents(exclude_classes[i]).length) {
                     return;
                 }
            }

            //close all open containers (except one - target)
            this.closeOthers(e.target);
        },

        // close all open containers (except one - target)
        closeOthers: function(element) {

            $('.sl-editor-open').each(function(i, el){

                var $el = $(el);

                //do nothing with passed element and it's children
                if(el === element || $el.find(element).length) {
                    return;
                }

                if($el.find('.form-group').hasClass('has-error')) {
                    return;
                }

                // slide up the edit panel
                $el.find('.sl-editor').slideUp('fast', function() {
                    // fadeIn view panel
                    $el.find('.sl-value').fadeIn('fast');
                });

                $el.removeClass('sl-editor-open');
            });
        }

    });

    return CalendarView;
});