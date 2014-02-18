define([
    'text!engineer/template/home/page.html',
    'common/view/friend/friend',
    'common/view/timeline/timeline'
], function(
    pageTemplate,
    FriendView,
    TimelineView
) {

    // PageView is the biggest frame of the application
    return Backbone.Marionette.Layout.extend({

        // Template
        template: pageTemplate,

        className: "row",

        // Events
        events: {
        },

        // Regions
        regions: {
            friendRegion: '#friend',
            timelineRegion: '#timeline',
        },

        // Initializer
        initialize: function() {

            this.friendView = new FriendView({
                model: this.model
            });

            this.timelineView = new TimelineView({
                model: this.model
            });
        },

        // After render
        onRender: function() {
            this.friendRegion.show(this.friendView);
            this.timelineRegion.show(this.timelineView);
        },

        // After show
        onShow: function() {
        },

    });

});