define([
    'text!common/template/group/edit/member.html',
    'common/view/group/edit/member/friends',
    'common/view/group/edit/member/people',
], function(
    template,
    FriendsView,
    PeopleView
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
        },

        // initializer
        initialize: function() {

            this.friendsView = new FriendsView({collection: selink.userModel.friends});
            this.peopleView = new PeopleView({collection: selink.userModel.friends});
        },

        // after render
        onRender: function() {

            // show friends area
            this.friendsRegion.show(this.friendsView);
            // show people area
            this.peopleRegion.show(this.peopleView);

        }

    });
});