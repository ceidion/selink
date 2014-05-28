define([
    'text!common/template/activity/item/user-activated.html',
    'text!common/template/activity/item/user-login.html',
    'text!common/template/activity/item/user-post.html',
    'text!common/template/activity/item/user-friend.html',
    'text!common/template/activity/item/user-job.html',
    'text!common/template/activity/item/default.html',
    'text!common/template/people/popover.html',
    'common/model/base'
], function(
    userActivatedTemplate,
    userLoginTemplate,
    userPostTemplate,
    userFriendInvitedTemplate,
    userJobTemplate,
    defaultTemplate,
    popoverTemplate,
    BaseModel
) {

    return Backbone.Marionette.ItemView.extend({

        loginActivity: ['user-login', 'user-logout'],

        userTargetActivity: ['user-friend-invited', 'user-friend-approved', 'user-friend-declined', 'user-friend-break'],

        postTargetActivity: ['user-post', 'user-post-liked', 'user-post-bookmarked', 'user-post-commented'],

        jobTargetActivity: ['user-job', 'user-job-bookmarked'],

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

        events: {
            'click .timeline-info img': 'toProfile',
        },

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
        },

        // after render
        onRender: function() {

            // add popover on photo
            this.$el.find('.timeline-info img').popover({
                html: true,
                trigger: 'hover',
                container: 'body',
                placement: 'auto right',
                title: '<img src="' + this.model.get('_owner').cover + '" />',
                content: _.template(popoverTemplate, this.model.get('_owner')),
            });
        },

        // turn to user profile page
        toProfile: function(e) {

            // stop defautl link behavior
            e.preventDefault();

            // destroy the popover on user's photo
            this.$el.find('.timeline-info img').popover('destroy');
            // turn the page manually
            window.location = '#profile/' + this.model.get('_owner')._id;
        },


    });
});