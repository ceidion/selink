define([
    'text!common/template/topnav/notification-item.html'
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        tagName: 'li',

        events: {
            'click .btn-approve': 'onApproveClick',
            'click .btn-decline': 'onDeclineClick'
        },

        // template
        getTemplate: function(){

            return template;
            // var type = this.model.get("type");

            // if (type == "user-activated")
            //     return userActivatedTemplate;
            // else if (type == "user-login")
            //     return userLoginTemplate;
            // else if (type == "user-logout")
            //     return userLogoutTemplate;
            // else if (type == "user-new-post")
            //     return userNewPostTemplate;
            // else
            //     return defaultTemplate;
        },

        onApproveClick: function() {
            this.model.save();
        },

        onDeclineClick: function() {

        }

    });
});