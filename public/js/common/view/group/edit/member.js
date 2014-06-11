define([
    'text!common/template/group/edit/member.html',
    'common/view/group/edit/member/friends',
    'common/view/group/edit/member/people',
    'common/view/group/edit/member/invited',
], function(
    template,
    FriendsView,
    PeopleView,
    InvitedView
) {

    return Backbone.Marionette.Layout.extend({

        // template
        template: template,

        // this view is a modal dialog
        className: 'modal-dialog job-modal',

        // regions
        regions: {
            friendsRegion: '#friends',
            peopleRegion: '#people',
            invitedRegion: '#invited',
        },

        // initializer
        initialize: function() {

            var self = this;

            var avaliableFriends = selink.userModel.friends.reject(function(friend) {
                return self.model.invited.findWhere({_id: friend.id});
            });

            this.friendsView = new FriendsView({
                model: this.model,
                collection: new Backbone.Collection(avaliableFriends)
            });
            // this.peopleView = new PeopleView({collection: selink.userModel.friends});

            this.invitedView = new InvitedView({
                model: this.model,
                collection: this.model.invited
            });
        },

        // after render
        onRender: function() {

            // show friends area
            this.friendsRegion.show(this.friendsView);

            // show people area
            // this.peopleRegion.show(this.peopleView);

            // show invited area
            this.invitedRegion.show(this.invitedView);

        }

    });
});