define([
    'text!engineer/template/home/page.html',
    'common/view/introduction/introduction',
    'common/view/timeline/timeline'
], function(
    pageTemplate,
    IntroductionView,
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
            introductionRegion: '#introduction',
            timelineRegion: '#timeline',
        },

        // Initializer
        initialize: function() {

            this.introductionView = new IntroductionView({
                model: this.model
            });

            this.timelineView = new TimelineView({
                model: this.model
            });
        },

        // After render
        onRender: function() {
            this.introductionRegion.show(this.introductionView);
            this.timelineRegion.show(this.timelineView);
        },

        // After show
        onShow: function() {
        },

    });

});