define([
    'text!engineer/template/home/page.html',
    'common/view/timeline/timeline'
], function(
    pageTemplate,
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

            this.timelineView = new TimelineView({
                model: this.model
            });
        },

        // After render
        onRender: function() {
            this.timelineRegion.show(this.timelineView);
        },

        // After show
        onShow: function() {
        },

    });

});