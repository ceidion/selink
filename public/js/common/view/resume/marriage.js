define([
    'common/view/item-base',
    'text!common/template/resume/marriage.html'
], function(
    BaseView,
    template) {

    var MarriageItem = BaseView.extend({

        // template
        template: template,

        // icon
        icon: 'icon-heart',

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
                    marriage: $target.closest('.btn').find('input').val()
                };
            else
                return {
                    marriage: $target.find('input').val()
                };
        },

        renderValue: function(data) {
            this.ui.value.text(data.marriage);
        },

        successMsg: function(data) {
            return "婚姻状況は「" +　data.marriage + "」に更新しました。";
        }
    });

    return MarriageItem;
});