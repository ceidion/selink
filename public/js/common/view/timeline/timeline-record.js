define([
    'common/view/item-base',
    'text!common/template/timeline/timeline-user-activated.html',
    'text!common/template/timeline/timeline-user-login.html',
    'text!common/template/timeline/timeline-user-logout.html',
    'text!common/template/timeline/timeline-default.html',
], function(
    BaseView,
    userActivatedTemplate,
    userLoginTemplate,
    userLogoutTemplate,
    defaultTemplate) {

    return BaseView.extend({

        // template
        getTemplate: function(){

            var type = this.model.get("type");

            if (type == "user-activated")
                return userActivatedTemplate;
            else if (type == "user-login")
                return userLoginTemplate;
            else if (type == "user-logout")
                return userLogoutTemplate;
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