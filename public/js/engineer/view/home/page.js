define([
    'text!engineer/template/home/page.html',
    'common/view/introduction/introductions'
], function(
    pageTemplate,
    IntroductionsView
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
        },

        // Initializer
        initialize: function() {

            this.introductionsView = new IntroductionsView();
        },

        // After render
        onRender: function() {
            console.log(this.introductionRegion);
            this.introductionRegion.show(this.introductionsView);
        },

        // After show
        onShow: function() {
        },
    });

});