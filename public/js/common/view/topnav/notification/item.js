define([
    'text!common/template/topnav/notification/item/user-friend.html',
    'text!common/template/topnav/notification/item/user-post.html',
    'text!common/template/topnav/notification/item/user-job.html',
], function(
    friendTemplate,
    postTemplate,
    jobTemplate
) {

    return Backbone.Marionette.ItemView.extend({

        userTargetNotification: ['user-friend-invited', 'user-friend-approved', 'user-friend-declined', 'user-friend-break'],

        postTargetNotification: ['user-post', 'user-post-liked', 'user-post-bookmarked', 'user-post-commented'],

        jobTargetNotification: ['user-job'],

        tagName: 'li',

        events: {
            'click .btn-approve': 'onApproveClick',
            'click .btn-decline': 'onDeclineClick',
            'click .btn-acknowledge': 'onAcknowledgeClick',
        },

        // template
        getTemplate: function(){

            var type = this.model.get("type");

            if (_.indexOf(this.userTargetNotification, type) >= 0)
                return friendTemplate;
            else if (_.indexOf(this.postTargetNotification, type) >= 0)
                return postTemplate;
            else if (_.indexOf(this.jobTargetNotification, type) >= 0)
                return jobTemplate;
        },

        onApproveClick: function(e) {

            // stop trigger the link on item
            e.preventDefault();

            var self = this;

            this.model.save({result: 'approved'}, {
                success: function() {
                    self.$el.slideUp(function() {
                        selink.userModel.friends.add(self.model.get('_from'));
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