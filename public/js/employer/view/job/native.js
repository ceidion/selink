define([
    'common/view/item-base',
    'text!employer/template/job/native.html'
], function(
    BaseView,
    template) {

    var NativeItem = BaseView.extend({

        // template
        template: template,

        // initializer
        initialize: function() {
            this.events = _.extend({}, this.events, {
                'click .btn': 'save'
            });
        },

        getData: function(event) {

            $target = $(event.target);

            // TODO: this is not right
            if ($target.prop('tagName') == "I")
                return {
                    nativesOnly: $target.closest('.btn').find('input').val()
                };
            else
                return {
                    nativesOnly: $target.find('input').val()
                };
        },

        renderValue: function(data) {
            console.log(data);
            this.ui.value.text(data.nativesOnly === true ? "不可" : "可");
        }

    });

    return NativeItem;
});