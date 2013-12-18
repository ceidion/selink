define(['text!template/signin.html'], function(template){

    var SignInView = Backbone.Marionette.ItemView.extend({

        template: template,

        tagName: 'form',

        className: 'navbar-form navbar-right',

        ui: {
            signInBtn: '.btn-signin'
        },

        events: {
            'click .btn-signin': 'onSignIn'
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

                // timeout in 3 seconds
                timeout: 3000,

                // disable the button and spin an icon
                beforeSend: function() {
                    self.ui.signInBtn.button('loading');
                },

                // login success handler
                success: function(account) {
                    window.location = '/home';
                },

                // login error handler
                error: function(xhr, status) {

                    if (status == 'timeout') {

                        $.gritter.add({
                            title: '<i class="icon-wrench icon-animated-wrench bigger-125"></i>&nbsp;&nbsp;サーバが応答しません',
                            text: 'サーバと通信できませんでした、しばらくお待ちいただき、もう一度お試してください。',
                            class_name: 'gritter-error',
                            sticky: false,
                            before_open: function(){
                                if($('.gritter-item-wrapper').length >= 3)
                                    return false;
                            },
                        });

                    } else if (status == 'error') {

                        var error = $.parseJSON(xhr.responseText);

                        $.gritter.add({
                            title: error.title,
                            text: error.msg,
                            class_name: 'gritter-error',
                            sticky: false,
                            before_open: function(){
                                if($('.gritter-item-wrapper').length >= 3)
                                    return false;
                            },
                        });
                    }
                },

                // reset button status to normal
                complete: function() {
                    self.ui.signInBtn.button('reset');
                }
            });
        }
    });

    return SignInView;
});