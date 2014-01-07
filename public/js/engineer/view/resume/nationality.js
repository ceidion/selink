define([
    'view/common/item-base',
    'text!template/resume/nationality.html'
], function(
    BaseView,
    template) {

    var NationalityItem = BaseView.extend({

        // template
        template: template,

        // icon
        icon: 'icon-flag',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'input': 'select'
            });

            this.events = _.extend({}, this.events, {
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

        getData: function() {
            return {
                nationality: this.ui.input.val()
            };
        },

        renderValue: function(data) {
            this.ui.value.text(data.nationality);
        },

        successMsg: function(data) {
            return "国籍は「" +　data.nationality + "」に更新しました。";
        }

    });

    return NationalityItem;
});