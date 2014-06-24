define([
    'text!common/template/group/detail/events.html',
    'common/view/group/detail/event'
], function(
    template,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // item view container
        itemViewContainer: this.$el,

        // item view
        itemView: ItemView,

        // Collection events
        collectionEvents: {
            'add': 'createEvent',
            'change': 'updateEvent',
            'remove': 'removeEvent',
        },

        // create new event
        createEvent: function(event) {

            var self = this;

            // safe the event
            this.collection.create(event, {

                // event saved successful
                success: function(model, response, options) {
                    selink.modalArea.$el.modal('hide');
                },
                wait: true
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
                    selink.modalArea.$el.modal('hide');
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
                    selink.modalArea.$el.modal('hide');
                },
                wait: true
            });

        }

    });
});