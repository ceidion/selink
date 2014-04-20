define([
    'text!common/template/notification/item/user-friend.html',
    'text!common/template/notification/item/user-post.html',
    'text!common/template/notification/item/user-job.html',
    'common/view/topnav/notification/item'
], function(
    friendTemplate,
    postTemplate,
    jobTemplate,
    BaseView
) {

    return BaseView.extend({

        tagName: 'div',

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

        onApproveClick: function() {

            var self = this,
                // TODO: this is may not good, server will return the updated notification,
                // but only contain the "_from" as id, and it will be set back to model,
                // I want add _from to friends list, have to put it here temporary
                friend = this.model.get('_from');

            this.model.save({result: 'approved'}, {
                url: '/notifications/' + this.model.get('_id'),
                success: function() {
                    selink.userModel.friends.add(friend);
                    self.$el.find('.pull-right').fadeOut(function() {
                        $(this).empty()
                            .html('<div class="text-muted pull-right"><i class="icon-ok"></i>&nbsp;承認済み</div>')
                            .fadeIn();
                    });
                    selink.userModel.notifications.remove(self.model.get('_id'));
                },
                patch: true
            });
        },

        onDeclineClick: function() {

            var self = this;

            this.model.save({result: 'declined'}, {
                url: '/notifications/' + this.model.get('_id'),
                success: function() {
                    self.$el.find('.pull-right').fadeOut(function() {
                        $(this).empty()
                            .html('<div class="text-muted pull-right"><i class="icon-ok"></i>&nbsp;拒否済み</div>')
                            .fadeIn();
                    });
                    selink.userModel.notifications.remove(self.model.get('_id'));
                },
                patch: true
            });
        },

        onAcknowledgeClick: function() {

            var self = this;

            this.model.save({result: 'acknowledged'}, {
                url: '/notifications/' + this.model.get('_id'),
                success: function() {
                    self.$el.find('.pull-right').fadeOut(function() {
                        $(this).empty()
                            .html('<div class="text-muted pull-right"><i class="icon-ok"></i>&nbsp;確認済み</div>')
                            .fadeIn();
                    });
                    selink.userModel.notifications.remove(self.model.get('_id'));
                },
                patch: true
            });
        }
    });
});