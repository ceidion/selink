define([
    'text!engineer/template/home/page.html',
    'common/collection/introductions'
], function(pageTemplate, IntroductionCollction) {

    // PageView is the biggest frame of the application
    var PageView = Backbone.Marionette.Layout.extend({

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

            var intro = new IntroductionCollction();
            intro.fetch({

            });
        },

        // After render
        onRender: function() {

            // this.listenTo(vent, 'logout:sessionTimeOut', this.doLogout);

        },

        // After show
        onShow: function() {
            // move in the page component
            // this.onPartScreen();
        },
    });

    return PageView;
});