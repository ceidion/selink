define([
    'text!common/template/topnav/notification/item/user-friend-invited.html',
    'text!common/template/topnav/notification/item/user-friend-approved.html',
    'text!common/template/topnav/notification/item/user-friend-declined.html',
    'text!common/template/topnav/notification/item/user-friend-break.html',
], function(
    friendInvitedTemplate,
    friendApprovedTemplate,
    friendDeclinedTemplate,
    friendBreakTemplate
) {

    return Backbone.Marionette.ItemView.extend({

        tagName: 'li',

        events: {
            'click .btn-approve': 'onApproveClick',
            'click .btn-decline': 'onDeclineClick',
            'click .btn-acknowledge': 'onAcknowledgeClick',
        },

        // template
        getTemplate: function(){

            var type = this.model.get("type");

            if (type == "user-friend-invited")
                return friendInvitedTemplate;
            else if (type == "user-friend-approved")
                return friendApprovedTemplate;
            else if (type == "user-friend-declined")
                return friendDeclinedTemplate;
            else if (type == "user-friend-break")
                return friendBreakTemplate;
        },

        onApproveClick: function(e) {

            // stop trigger the link on item
            e.preventDefault();

            var self = this;

            this.model.save({result: 'approved'}, {
                success: function() {
                    self.$el.slideUp(function() {
                        self.model.collection.remove(self.model);
                    });
                },
                patch: true
            });
        },

        onDeclineClick: function(e) {

            // stop trigger the link on item
            e.preventDefault();

            var self = this;

            this.model.save({result: 'declined'}, {
                success: function() {
                    self.$el.slideUp(function() {
                        self.model.collection.remove(self.model);
                    });
                },
                patch: true
            });
        },

        onAcknowledgeClick: function(e) {

            // stop trigger the link on item
            e.preventDefault();

            var self = this;

            this.model.save({result: 'acknowledged'}, {
                success: function() {
                    self.$el.slideUp(function() {
                        self.model.collection.remove(self.model);
                    });
                },
                patch: true
            });
        }
    });
});