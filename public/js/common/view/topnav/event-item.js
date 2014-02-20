define([
    'text!common/template/topnav/event-item.html'
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        tagName: 'li',

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
        }

    });
});