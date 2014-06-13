define([
    'text!common/template/group/edit/member.html',
    'common/view/group/edit/member/friends',
    'common/view/group/edit/member/people',
    'common/view/group/edit/member/invited',
    'common/view/group/edit/member/participants',
], function(
    template,
    FriendsView,
    PeopleView,
    InvitedView,
    ParticipantsView
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
            participantsRegion: '#participants',
        },

        // initializer
        initialize: function() {

            var self = this;

            // people in my friend list but not in the group yet
            var avaliableFriends = selink.userModel.friends.reject(function(friend) {
                // neither in invited list nor in pariticipants list
                return self.model.invited.findWhere({_id: friend.id}) || self.model.participants.findWhere({_id: friend.id});
            });

            // if there is any friend avaliable
            if (avaliableFriends.length)
                // build friend view
                this.friendsView = new FriendsView({
                    model: this.model,
                    collection: new Backbone.Collection(avaliableFriends)
                });

            // people ont in my friends list
            this.peopleView = new PeopleView({
                model: this.model
            });

            // people been invited to this group
            this.invitedView = new InvitedView({
                model: this.model,
                collection: this.model.invited
            });

            // people already in this group
            this.participantsView = new ParticipantsView({
                model: this.model,
                collection: this.model.participants
            });
        },

        // after render
        onRender: function() {

            if (this.friendsView)
                // show friends area
                this.friendsRegion.show(this.friendsView);

            // show people area
            this.peopleRegion.show(this.peopleView);

            // show invited area
            this.invitedRegion.show(this.invitedView);

            // show participants area
            this.participantsRegion.show(this.participantsView);

        }

    });
});