define([
    'view/common/item-base',
    'text!template/resume/nearestSt.html'
], function(
    BaseView,
    template) {

    var NearestStItem = BaseView.extend({

        // template
        template: template,

        // icon
        icon: 'icon-road',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'input': 'input'
            });

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
                nearestSt: this.ui.input.val()
            };
        },

        renderValue: function(data) {

            if (!data.nearestSt) {
                this.ui.value.html(this.placeholder);
                return;
            }

            this.ui.value.text(data.nearestSt);
        },

        successMsg: function(data) {

            if (!data.nearestSt)
                return "最寄駅情報はクリアしました。";

            return "最寄駅は「" +　data.nearestSt + "」に更新しました。";
        }

    });

    return NearestStItem;
});