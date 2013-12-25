define([
    'view/common/item-base',
    'text!template/resume/nearestSt.html'
], function(
    BaseView,
    template) {

    var NearestStItem = BaseView.extend({

        // template
        template: template,

        // initializer
        initialize: function() {

            this.events = _.extend({}, this.events, {
                'change input': 'submitForm'
            });
        },

        // after render
        onRender: function() {

            var self = this;

            // call super class method append validator
            BaseView.prototype.onRender.call(this, {

                onfocusout: false,

                onkeyup: false,

                rules: {
                    nearestSt: {
                        maxlength: 30
                    }
                },

                messages: {
                    nearestSt: {
                        maxlength: "最寄駅は最大30文字までご入力ください"
                    }
                }
            });
        },

        submitForm: function() {
            this.$el.find('form').submit();
        },

        getData: function() {
            return {
                nearestSt: this.$el.find('input').val()
            };
        },

        renderValue: function(data) {
            this.ui.value.text(this.$el.find('input').val());
        },

        successMsg: function(data) {
            return "最寄駅は「" +　this.$el.find('input').val() + "」に更新しました。";
        }

    });

    return NearestStItem;
});