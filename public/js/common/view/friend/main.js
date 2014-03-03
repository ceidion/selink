define([
    'text!common/template/friend/main.html',
    'common/view/friend/invited',
    'common/view/friend/friend',
], function(
    pageTemplate,
    InvitedView,
    FriendsView
) {

    return Backbone.Marionette.Layout.extend({

        // Template
        template: pageTemplate,

        // class name
        className: "row",

        // Regions
        regions: {
            invitedRegion: '#invited',
            friendsRegion: '#friends'
        },

        // Initializer
        initialize: function() {
            this.invitedView = new InvitedView({
                model: selink.userModel
            });
            this.friendsView = new FriendsView({
                model: selink.userModel
            });
        },

        // After render
        onRender: function() {
            this.invitedRegion.show(this.invitedView);
            this.friendsRegion.show(this.friendsView);
        },

        // After show
        onShow: function() {
            // this.$el.addClass('animated fadeInRight');

            // make scrollable
            this.$el.find('#invited').slimScroll({
                height: 300,
                railVisible:true
            });
        }
    });

});