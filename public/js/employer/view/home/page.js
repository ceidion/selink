define([
    'text!templates/home/page.html'
], function(pageTemplate) {

    // PageView is the biggest frame of the application
    var PageView = Backbone.Marionette.ItemView.extend({

        // Template
        template: pageTemplate,

        className: "row",

        // Events
        events: {
            'click #logoutBtn': 'onLogout',
            'click': 'onClick'
        },

        // Regions
        regions: {
            header: '#header',
            content: '#content',
            footer: '#footer'
        },

        // Initializer
        initialize: function() {

            // for slide animation effect change the default
            // behavior of show view on content region
            // this.content.open = function(view) {
            //     this.$el.hide();
            //     this.$el.html(view.el);
            //     this.$el.fadeIn();
            // };
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