define([
    'common/view/item-base',
    'text!common/template/profile/telno.html'
], function(
    BaseView,
    template) {

    var TelNoItem = BaseView.extend({

        // template
        template: template,

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
        }

    });

    return TelNoItem;
});