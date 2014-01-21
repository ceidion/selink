define(['text!template/signin.html'], function(template){

    var SignInView = Backbone.Marionette.ItemView.extend({

        template: template,

        tagName: 'form',

        className: 'navbar-form navbar-right',

        ui: {
            signInBtn: '.btn-signin'
        },

        events: {
            // 'click .btn-signin': 'onSignIn'
        },

        onRender: function() {

            var self = this;

            this.$el.validate({

                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true
                    }
                },

                messages: {
                    email: {
                        required: "メールアドレスをご入力ください",
                        email: "メールアドレスのフォーマットでご入力ください"
                    },
                    password: {
                        required: "パースワードをご入力ください"
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit
                    $('.alert-danger', $('.login-form')).show();
                },

                highlight: function (e) {
                    $(e).addClass('animated-input-error tooltip-error')
                        .closest('.form-group')
                        .removeClass('has-success')
                        .addClass('has-error');
                },

                unhighlight: function(e) {
                    $(e).removeClass('animated-input-error tooltip-error')
                        .tooltip('destroy')
                        .closest('.form-group')
                        .removeClass('has-error')
                        .addClass('has-success');
                },

                success: function (e) {
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
                        error.insertAfter(element.parent()).addClass('hidden');
                        element.tooltip({
                            placement: 'bottom',
                            title: error.text()
                        });
                    }
                },

                submitHandler: function (form) {
                    self.onSignIn();
                }
            });
        },

        // sign in process
        onSignIn: function(e) {

            // prevent default submit action
            // e.preventDefault();

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
                    window.location = '/spa';
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