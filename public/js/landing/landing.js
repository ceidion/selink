define(["view/signin"], function(SignInView) {

    // create application instance
    var landing = new Backbone.Marionette.Application();

    // create regions
    landing.addRegions({
        loginArea: '.navbar-form'
    });

    // initialize application
    landing.addInitializer(function(options) {

        // switch page with fade effect
        Backbone.Marionette.Region.prototype.open = function(view){
            this.$el.hide();
            this.$el.html(view.el);
            this.$el.fadeIn();
        };

        var signInView = new SignInView({el: '.navbar-form'});
    });

    return landing;
});