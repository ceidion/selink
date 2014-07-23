define([
    'text!common/template/group/main.html',
    'common/view/group/list',
    'common/view/group/joined',
    'common/view/group/mine',
], function(
    template,
    ListView,
    JoinedView,
    MineView
) {

    return Backbone.Marionette.LayoutView.extend({

        // Template
        template: template,

        // events
        events: {
            'click button[href="#list"]': 'showListView',
            'click button[href="#joined"]': 'showJoinedView',
            'click button[href="#mine"]': 'showMineView'
        },

        // regions
        regions: {
            listRegion: '#list',
            joinedRegion: '#joined',
            mineRegion: '#mine'
        },

        // after show
        onShow: function() {

            // create group list view, don't do this in initialize method
            // cause the infinite scroll need the item container in the dom tree
            this.listView = new ListView();
            // show list view on start
            this.listRegion.show(this.listView);

        },

        showListView: function() {
            // lazy load group list view
            if (!this.listView) {
                this.listView = new ListView();
                this.listRegion.show(this.listView);
            }
        },

        showJoinedView: function() {
            // lazy load joined group view
            if (!this.joinedView) {
                this.joinedView = new JoinedView();
                this.joinedRegion.show(this.joinedView);
            }
        },

        showMineView: function() {
            // lazy load mine group view
            if (!this.mineView) {
                this.mineView = new MineView();
                this.mineRegion.show(this.mineView);
            }
        }
    });
});