define([
    'view/common/item-base',
    'text!template/resume/experience.html'
], function(
    BaseView,
    template) {

    var ExperienceItem = BaseView.extend({

        // template
        template: template,

        // icon
        icon: 'icon-suitcase',

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
        },

        successMsg: function(data) {

            if (!data.experience)
                return "IT経験年数情報はクリアしました。";

            return "IT経験年数は「" +　data.experience + "年」に更新しました。";
        }

    });

    return ExperienceItem;
});