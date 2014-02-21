define([
    'text!common/template/friend/main.html',
    'common/view/friend/friend-wait',
    'common/view/friend/friend',
], function(
    pageTemplate,
    WaitApproveView,
    FriendsView
) {

    return Backbone.Marionette.Layout.extend({

        // Template
        template: pageTemplate,

        // class name
        className: "row",

        // Regions
        regions: {
            waitApproveRegion: '#wait-approve',
            friendsRegion: '#friends'
        },

        // Initializer
        initialize: function() {
            this.waitApproveView = new WaitApproveView({
                model: selink.userModel
            });
            this.friendsView = new FriendsView({
                model: selink.userModel
            });
        },

        // After render
        onRender: function() {
            this.waitApproveRegion.show(this.waitApproveView);
            this.friendsRegion.show(this.friendsView);
        },

        // After show
        onShow: function() {
            // this.$el.addClass('animated fadeInRight');
        }
    });

});