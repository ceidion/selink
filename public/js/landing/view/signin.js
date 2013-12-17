define([], function(){

    var SignInView = Backbone.Marionette.ItemView.extend({

        events: {
            "click .btn-signin": "onSignIn"
        },

        // sign in process
        onSignIn: function(e) {

            // prevent default submit action
            e.preventDefault();

            var self = this;

            // sign-in
            $.ajax({

                // page url
                url: '/login',

                // post form data
                data: this.$el.serialize(),

                // method is post
                type: 'POST',

                // use json format
                dataType: 'json',

                // login success handler
                success: function(account) {
                    window.location = '/home';
                },

                // login error handler
                error: function(xhr, status) {

                    var error = $.parseJSON(xhr.responseText);

                    $.gritter.add({
                        title: error.title,
                        text: error.msg,
                        class_name: 'gritter-error',
                        sticky: false,
                        before_open: function(){
                            if($('.gritter-item-wrapper').length >= 3)
                            {
                                return false;
                            }
                        },
                    });
                }
            });
        }
    });

    return SignInView;
});