define([
    'view/common/item-base',
    'text!template/resume/nationality.html'
], function(
    BaseView,
    template) {

    var NationalityItem = BaseView.extend({

        // template
        template: template,

        // initializer
        initialize: function() {

            this.events = _.extend(this.events, {
                'change select': 'save'
            });
        },

        // after render
        onRender: function() {

            // enable chosen
            this.$el.find('select').chosen({
                width: "95%",
                no_results_text: "該当国名は存在しません"
            });
        },

        submitForm: function() {
            this.$el.find('form').submit();
        },

        getData: function() {
            return {
                nationality: this.$el.find('select').val()
            };
        },

        renderValue: function(data) {
            this.ui.value.text(this.$el.find('select').val());
        },

        successMsg: function(data) {
            return "国籍は「" +　this.$el.find('select').val() + "」に更新しました。";
        }

    });

    return NationalityItem;
});