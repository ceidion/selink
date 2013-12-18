define([
    "view/signin",
    "view/signup"
], function(
    SignInView,
    SignUpView
) {

    // create application instance
    var landing = new Backbone.Marionette.Application();

    // create regions
    landing.addRegions({
        signInArea: '#sign-in-area',
        signUpArea: '#sign-up-area'
    });

    // initialize application
    landing.addInitializer(function(options) {

        // switch page with fade effect
        Backbone.Marionette.Region.prototype.open = function(view){
            this.$el.hide();
            this.$el.html(view.el);
            this.$el.fadeIn();
        };

        var signInView = new SignInView();
        this.signInArea.show(signInView);

        var signUpView = new SignUpView();
        this.signUpArea.show(signUpView);
    });

    return landing;
});