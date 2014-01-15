define([
    'common/view/item-base',
    'text!common/template/resume/telno.html'
], function(
    BaseView,
    template) {

    var TelNoItem = BaseView.extend({

        // template
        template: template,

        // icon
        icon: 'icon-phone',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'input': 'input'
            });

            this.events = _.extend({}, this.events, {
                'change input': 'save'
            });
        },

        // after render
        onRender: function() {

            var self = this;

            // enable mask input
            this.ui.input.mask('(999)9999-9999');
        },

        getData: function() {
            return {
                telNo: this.ui.input.val()
            };
        },

        renderValue: function(data) {

            if (!data.telNo) {
                this.ui.value.html(this.placeholder);
                return;
            }

            this.ui.value.text(data.telNo);
        },

        successMsg: function(data) {

            if (!data.telNo)
                return "電話番号はクリアしました。";

            return "電話番号は「" +　data.telNo + "」に更新しました。";
        }

    });

    return TelNoItem;
});