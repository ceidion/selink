define([
    'view/common/item-base',
    'text!template/resume/birthday.html'
], function(
    BaseView,
    template) {

    // birth day item
    var BirthDayItem = BaseView.extend({

        // template
        template: template,

        // initializer
        initialize: function() {

            this.events = _.extend(this.events, {
                'change #birthday-item': 'submitForm'
            });

            // BaseView.prototype.initialize(this, arguments);

            // console.log("from sub");
            // console.log(this.ui);
            // console.log(this.events);

            // this.ui = _.extend({}, this.commonUI);
            // this.events = _.extend({}, this.commonEvents, {
            //     'change #birthday-item': 'submitForm'
            // });
        },

        // after render
        onRender: function() {

            var self = this;

            // append data picker
            this.$el.find('#birthday-item').datepicker({
                autoclose: true,
                language: 'ja'
            });

            // enable mask input
            this.$el.find('#birthday-item').mask('9999/99/99');

            BaseView.prototype.onRender.call(this, {

                onfocusout: false,

                onkeyup: false,

                rules: {
                    birthDay: {
                        email: true
                    }
                },

                messages: {
                    birthDay: {
                        email: "メールアドレスのフォーマットでご入力ください"
                    }
                }
            });

            // this.$el.find('form').validate(_.extend({}, this.commonValidate, {

            //     onfocusout: false,

            //     onkeyup: false,

            //     rules: {
            //         birthDay: {
            //             dateISO: true
            //         }
            //     },

            //     messages: {
            //         birthDay: {
            //             dateISO: "メールアドレスのフォーマットでご入力ください"
            //         }
            //     },

            //     submitHandler: function (form) {
            //         self.onSignIn();
            //     }
            // }));
        },

        onSignIn: function() {

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
                    console.log("start");
                    // self.ui.signInBtn.button('loading');
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
                    // self.ui.signInBtn.button('reset');
                }
            });
        },

        submitForm: function() {
            this.$el.find('form').submit();
        }
    });

    return BirthDayItem;
});