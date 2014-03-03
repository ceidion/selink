define([
    'text!common/template/friend/main.html',
    'common/view/friend/invited',
    'common/view/friend/friend',
    'common/view/post/item'
], function(
    pageTemplate,
    InvitedView,
    FriendsView,
    ItemView
) {

    var PostsCollection = define(['common/model/post'], function(PostModel) {

        var Posts = Backbone.Collection.extend({

            idAttribute: "_id",

            model: PostModel,

            url: function() {
                return this.document.url() + '/posts';
            }
        });

        return Posts;
    });

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
        }
    });

});