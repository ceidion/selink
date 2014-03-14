define([
    'common/view/item-base',
    'text!common/template/profile/experience.html'
], function(
    BaseView,
    template) {

    return BaseView.extend({

        // template
        template: template,

        className: 'row',

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
            this.ui.input.mask('9?9');
        },

        getData: function() {
            return {
                experience: Number(this.ui.input.val())
            };
        },

        renderValue: function(data) {

            if (!data.experience) {
                this.ui.value.html(this.placeholder);
                return;
            }

            this.ui.value.text(data.experience + "年");
        }

    });
});