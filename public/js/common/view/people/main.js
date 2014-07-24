define([
    'text!common/template/people/main.html',
    'common/view/people/discover',
    'common/view/people/friends',
    'common/view/people/invited',
], function(
    template,
    DiscoverView,
    FriendsView,
    InvitedView
) {

    return Backbone.Marionette.LayoutView.extend({

        // Template
        template: template,

        // events
        events: {
            'click .btn-friends': 'showFriendsView',
            'click .btn-invited': 'showInvitedView',
            'click .btn-discover': 'showDiscoverView'
        },

        // regions
        regions: {
            displayRegion: '#display'
        },

        // after show
        onShow: function() {

            // create friends view, don't do this in initialize method
            // cause the infinite scroll need the item container in the dom tree
            this.friendsView = new FriendsView();
            // show friends view on start
            this.displayRegion.show(this.friendsView);

        },

        showDiscoverView: function() {
            // lazy load people discover view
            this.discoverView = new DiscoverView();
            this.displayRegion.show(this.discoverView);
        },

        showFriendsView: function() {
            // lazy load friends view
            this.friendsView = new FriendsView();
            this.displayRegion.show(this.friendsView);
        },

        showInvitedView: function() {
            // lazy load invited people view
            this.invitedView = new InvitedView();
            this.displayRegion.show(this.invitedView);
        }
    });
});