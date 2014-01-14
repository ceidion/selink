define([
    'view/common/composite-base',
    'text!template/resume/employments.html',
    'view/resume/employment',
    'model/profile/employments',
], function(
    BaseView,
    template,
    ItemView,
    EmploymentsModel) {

    var EmploymentComposite = BaseView.extend({

        // template
        template: template,

        // for dnd add class here
        className: 'widget-box transparent',

        // icon
        icon: 'icon-briefcase',

        // item view container
        itemViewContainer: '.widget-main',

        // item view
        itemView: ItemView,

        // max item number
        itemLimit: 4,

        // initializer
        initialize: function() {

            this.events = _.extend({}, this.events);

            this.collection = new EmploymentsModel(this.model.get('employments'));
            this.collection.document = this.model;
        },

        onRender: function() {

            this.$el.find('.btn-add').tooltip({
                placement: 'top',
                title: "社歴を追加"
            });

            this.$el.find('.btn-sort').tooltip({
                placement: 'top',
                title: "並び替え"
            });

            this.$el.find('.btn-handle').tooltip({
                placement: 'top',
                title: "ドラグして移動"
            });
        },

        updateMsg: function(data) {
            return "社歴「" +　data.language + "」を" + data.weight + "ptに更新しました。";
        },

        removeMsg: function(data) {
            return "社歴「" +　data.language + "(" + data.weight + "pt)」を削除しました。";
        }
    });

    return EmploymentComposite;
});