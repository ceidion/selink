define([
    'common/view/item-base',
    'text!common/template/profile/gender.html'
], function(
    BaseView,
    template) {

    var GenderItem = BaseView.extend({

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
                    gender: $target.closest('.btn').find('input').val()
                };
            else
                return {
                    gender: $target.find('input').val()
                };
        },

        renderValue: function(data) {
            this.ui.value.text(data.gender);
        }

    });

    return GenderItem;
});