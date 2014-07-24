define([
    'text!common/template/group/main.html',
    'common/view/group/discover',
    'common/view/group/joined',
    'common/view/group/mine',
], function(
    template,
    DiscoverView,
    JoinedView,
    MineView
) {

    return Backbone.Marionette.LayoutView.extend({

        // Template
        template: template,

        // events
        events: {
            'click .btn-discover': 'showDiscoverView',
            'click .btn-joined': 'showJoinedView',
            'click .btn-mine': 'showMineView'
        },

        // regions
        regions: {
            displayRegion: '#display'
        },

        // after show
        onShow: function() {

            // create group discover view, don't do this in initialize method
            // cause the infinite scroll need the item container in the dom tree
            this.discoverView = new DiscoverView();
            // show discover view on start
            this.displayRegion.show(this.discoverView);

        },

        showDiscoverView: function() {
            // lazy load group discover view
            this.discoverView = new DiscoverView();
            this.displayRegion.show(this.discoverView);
        },

        showJoinedView: function() {
            // lazy load joined group view
            this.joinedView = new JoinedView();
            this.displayRegion.show(this.joinedView);
        },

        showMineView: function() {
            // lazy load mine group view
            this.mineView = new MineView();
            this.displayRegion.show(this.mineView);
        }
    });
});