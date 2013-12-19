define(['text!template/signup.html'], function(template){

    var SignUpView = Backbone.Marionette.ItemView.extend({

        template: template,

        id: 'signup-box',

        className: 'signup-box widget-box',

        ui: {
            form: 'form',
            signUpBtn: '.btn-signup',
            errorAlert: '.alert-danger',
            successAlert: '.alert-success'
        },

        events: {
            'click .btn-signup': 'onSignUp'
        },

        // sign up process
        onSignUp: function(e) {

            // prevent default submit action
            e.preventDefault();

            var self = this;

            // sign-up
            $.ajax({

                // page url
                url: '/signup',

                // post form data
                data: this.ui.form.serialize(),

                // method is post
                type: 'POST',

                // use json format
                dataType: 'json',

                // timeout in 3 seconds
                timeout: 3000,

                // disable the button and spin an icon
                beforeSend: function() {
                    self.ui.signUpBtn.button('loading');
                },

                // sign up success handler
                success: function(result) {

                    self.ui.successAlert.text(result.msg).slideDown(function() {
                        self.ui.form.find("input, textarea").val("");
                        setTimeout(function() {
                            self.ui.successAlert.slideUp();
                        }, 3000);
                    });
                },

                // sign up error handler
                error: function(xhr, status) {

                    if (status == 'timeout') {

                        $.gritter.add({
                            title: '<i class="icon-wrench icon-animated-wrench bigger-125"></i>&nbsp;&nbsp;サーバが応答しません',
                            text: 'サーバと通信できませんでした、しばらくお待ちいただき、もう一度お試してください。',
                            class_name: 'gritter-error',
                            sticky: false,
                            before_open: function(){
                                if($('.gritter-item-wrapper').length >= 3)
                                {
                                    return false;
                                }
                            },
                        });

                    } else if (status == 'error') {

                        var error = $.parseJSON(xhr.responseText);

                        self.ui.errorAlert.text(error.msg).slideDown(function() {
                            setTimeout(function() {
                                self.ui.errorAlert.slideUp();
                            }, 3000);
                        });
                    }
                },

                // reset button status to normal
                complete: function() {
                    self.ui.signUpBtn.button('reset');
                }
            });
        }
    });

    return SignUpView;
});