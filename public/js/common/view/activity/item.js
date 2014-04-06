define([
    'text!common/template/activity/item/user-activated.html',
    'text!common/template/activity/item/user-login.html',
    'text!common/template/activity/item/user-post.html',
    'text!common/template/activity/item/user-friend.html',
    'text!common/template/activity/item/user-job.html',
    'text!common/template/activity/item/default.html',
    'common/model/base'
], function(
    userActivatedTemplate,
    userLoginTemplate,
    userPostTemplate,
    userFriendInvitedTemplate,
    userJobTemplate,
    defaultTemplate,
    BaseModel
) {

    return Backbone.Marionette.ItemView.extend({

        loginActivity: ['user-login', 'user-logout'],

        userTargetActivity: ['user-friend-invited', 'user-friend-approved', 'user-friend-declined', 'user-friend-break'],

        postTargetActivity: ['user-post', 'user-post-liked', 'user-post-bookmarked', 'user-post-commented'],

        jobTargetActivity: ['user-job'],

        // template
        getTemplate: function(){

            var type = this.model.get("type");

            if (type == "user-activated")
                return userActivatedTemplate;
            else if (_.indexOf(this.loginActivity, type) >= 0)
                return userLoginTemplate;
            else if (_.indexOf(this.userTargetActivity, type) >= 0)
                return userFriendInvitedTemplate;
            else if (_.indexOf(this.postTargetActivity, type) >= 0)
                return userPostTemplate;
            else if (_.indexOf(this.jobTargetActivity, type) >= 0)
                return userJobTemplate;
            else
                return defaultTemplate;
        },

        className: 'timeline-item clearfix',

        // initializer
        initialize: function() {

            var self = this,
                type = this.model.get('type'),
                target = new BaseModel();
            
            // TODO: maybe these are should be done on server side
            if ( _.indexOf(this.userTargetActivity, type) >= 0 ) {

                target.fetch({
                    url: '/users/' + this.model.get('target'),
                    success: function() {
                        self.model.set('target', target.attributes);
                        self.render();
                    }
                });

            } else if ( _.indexOf(this.postTargetActivity, type) >= 0 ) {

                target.fetch({
                    url: '/posts/' + this.model.get('target'),
                    success: function() {
                        self.model.set('target', target.attributes);
                        self.render();
                    }
                });
            } else if ( _.indexOf(this.jobTargetActivity, type) >= 0 ) {

                target.fetch({
                    url: '/jobs/' + this.model.get('target'),
                    success: function() {
                        self.model.set('target', target.attributes);
                        self.render();
                    }
                });
            }
        }

    });
});