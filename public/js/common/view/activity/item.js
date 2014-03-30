define([
    'text!common/template/activity/item/user-activated.html',
    'text!common/template/activity/item/user-login.html',
    'text!common/template/activity/item/user-logout.html',
    'text!common/template/activity/item/user-post.html',
    'text!common/template/activity/item/user-friend-invited.html',
    'text!common/template/activity/item/user-job.html',
    'text!common/template/activity/item/default.html',
], function(
    userActivatedTemplate,
    userLoginTemplate,
    userLogoutTemplate,
    userPostTemplate,
    userFriendInvitedTemplate,
    userJobTemplate,
    defaultTemplate) {

    return Backbone.Marionette.ItemView.extend({

        // template
        getTemplate: function(){

            var type = this.model.get("type");

            if (type == "user-activated")
                return userActivatedTemplate;
            else if (type == "user-login")
                return userLoginTemplate;
            else if (type == "user-logout")
                return userLogoutTemplate;
            else if (type == "user-post")
                return userPostTemplate;
            else if (type == "user-friend-invited" || type == "user-friend-approved")
                return userFriendInvitedTemplate;
            else if (type == "user-job")
                return userJobTemplate;
            else
                return defaultTemplate;
        },

        className: 'timeline-item clearfix',

        // initializer
        initialize: function() {
            this.events = _.extend({}, this.events);
        },

        onRender: function() {
        }
    });

});