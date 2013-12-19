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

        onRender: function() {

            this.$el.validate({

                // errorElement: 'div',

                // errorClass: 'help-block',

                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true,
                        minlength: 8
                    }
                },

                messages: {
                    email: {
                        required: "Please provide a valid email.",
                        email: "Please provide a valid email."
                    },
                    password: {
                        required: "Please specify a password.",
                        minlength: "Please specify a secure password."
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit
                    console.log("message2");
                    $('.alert-danger', $('.login-form')).show();
                },

                highlight: function (e) {
                    $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
                },

                success: function (e) {
                    $(e).closest('.form-group').removeClass('has-error').addClass('has-info');
                    $(e).remove();
                },

                errorPlacement: function (error, element) {
                    if(element.is(':checkbox') || element.is(':radio')) {
                        var controls = element.closest('div[class*="col-"]');
                        if(controls.find(':checkbox,:radio').length > 1) controls.append(error);
                        else error.insertAfter(element.nextAll('.lbl:eq(0)').eq(0));
                    }
                    else if(element.is('.select2')) {
                        error.insertAfter(element.siblings('[class*="select2-container"]:eq(0)'));
                    }
                    else if(element.is('.chosen-select')) {
                        error.insertAfter(element.siblings('[class*="chosen-container"]:eq(0)'));
                    }
                    else {
                        console.log(error);
                        // error.insertAfter(element.parent());
                        element.addClass('animated-vertical tooltip-error').tooltip({
                            placement: 'bottom',
                            title: error.text()
                        });
                    }
                },

                submitHandler: function (form) {
                    console.log("message");
                },
            });
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
        },
    });

    return SignInView;
});