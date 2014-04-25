define([
    'text!common/template/mailbox/item.html'
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        className: 'message-item',

        // template
        template: template,

        ui: {
            subject: '.text'
        },

        events: {
            'click .text': 'showMessage'
        },

        initialize: function() {

            var userId = selink.userModel.get('_id');

            // if the message belong to the user
            if (this.model.get('_from')._id != userId)
                // mark it as sent message
                this.model.set('isMine', true, {silent: true});

            // if the message not belong to the user
            // or user's id exists in message's opened list
            if (this.model.get('_from')._id != userId
                && _.indexOf(this.model.get('opened'), userId) < 0) {
                // mark as unread
                this.$el.addClass('message-unread');
                this.model.set('isUnread', true, {silent: true});
            }
        },

        showMessage: function() {

            if (this.model.get('isUnread'))
                this.model.save({opened: true}, {
                    patch: true,
                    wait: true
                });

            this.$el.toggleClass('message-inline-open')
                .find('.message-content').slideToggle();
        }

    });
});