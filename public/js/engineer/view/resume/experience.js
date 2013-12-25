define([
    'view/common/item-base',
    'text!template/resume/experience.html'
], function(
    BaseView,
    template) {

    var ExperienceItem = BaseView.extend({

        // template
        template: template,

        // initializer
        initialize: function() {

            this.events = _.extend({}, this.events, {
                'change input': 'save'
            });
        },

        // after render
        onRender: function() {

            var self = this;

            // enable mask input
            this.$el.find('input').mask('99');
            this.$el.find('input').ace_spinner({
                value: 0,
                min: 0,
                max: 99,
                step: 1,
                btn_up_class: 'btn-info',
                btn_down_class:'btn-warning'
            });

        },

        getData: function() {
            return {
                birthDay: this.$el.find('input').val()
            };
        },

        renderValue: function(data) {
            this.ui.value.text(this.$el.find('input').val());
        },

        successMsg: function(data) {
            return "IT経験年数は「" +　this.$el.find('input').val() + "年」に更新しました。";
        }

    });

    return ExperienceItem;
});