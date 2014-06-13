define([
    'text!common/template/topnav/notification/item/user-friend.html',
    'text!common/template/topnav/notification/item/user-post.html',
    'text!common/template/topnav/notification/item/user-job.html',
    'text!common/template/topnav/notification/item/group.html',
], function(
    friendTemplate,
    postTemplate,
    jobTemplate,
    groupTemplate
) {

    return Backbone.Marionette.ItemView.extend({

        // notification type regard friend relation
        userTargetNotification: ['user-friend-invited', 'user-friend-approved', 'user-friend-declined', 'user-friend-break'],

        // notification type regard post action
        postTargetNotification: ['user-post', 'user-post-liked', 'user-post-bookmarked', 'user-post-commented', 'user-comment-liked'],

        // notification type regard job action
        jobTargetNotification: ['user-job', 'user-job-bookmarked'],

        // notification type regard group relation
        groupTargetNotification: ['new-group', 'group-invited', 'group-joined', 'group-refused'],

        tagName: 'li',

        events: {
            'click .btn-approve': 'onApproveClick',
            'click .btn-decline': 'onDeclineClick',
            'click .btn-join': 'onJoinClick',
            'click .btn-refuse': 'onRefuseClick',
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
            else if (_.indexOf(this.groupTargetNotification, type) >= 0)
                return groupTemplate;
        },

        // approve friend request
        onApproveClick: function(e) {

            // stop trigger the link on item
            e.preventDefault();

            var self = this,
                // TODO: this is may not good, server will return the updated notification,
                // but only contain the "_from" as id, and it will be set back to model,
                // cause I want add _from to friends list, have to put it here temporary
                friend = this.model.get('_from');

            this.model.save({result: 'approved'}, {
                success: function() {
                    self.$el.slideUp(function() {
                        selink.userModel.friends.add(friend);
                        self.model.collection.remove(self.model);
                    });
                },
                patch: true
            });
        },

        // decline friend request
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

        // accept group invitation
        onJoinClick: function(e) {

            // stop trigger the link on item
            e.preventDefault();

            var self = this;

            this.model.save({result: 'accepted'}, {
                success: function() {
                    self.$el.slideUp(function() {
                        self.model.collection.remove(self.model);
                    });
                },
                patch: true
            });
        },

        // refuse group invitation
        onRefuseClick: function(e) {

            // stop trigger the link on item
            e.preventDefault();

            var self = this;

            this.model.save({result: 'refused'}, {
                success: function() {
                    self.$el.slideUp(function() {
                        self.model.collection.remove(self.model);
                    });
                },
                patch: true
            });
        },

        // acknowledge a simple notification
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