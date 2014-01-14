define([
    'view/common/composite-base',
    'text!template/resume/skills.html',
    'view/resume/skill',
    'model/profile/skills',
], function(
    BaseView,
    template,
    ItemView,
    SkillsModel) {

    var SkillComposite = BaseView.extend({

        // template
        template: template,

        // for dnd add class here
        className: 'widget-box transparent',

        // icon
        icon: 'icon-wrench',

        // item view container
        itemViewContainer: '.widget-main',

        // item view
        itemView: ItemView,

        // max item number
        itemLimit: 8,

        // initializer
        initialize: function() {
            this.events = _.extend({}, this.events);

            this.collection = new SkillsModel(this.model.get('skills'));
            this.collection.document = this.model;
        },

        onRender: function() {

            this.$el.find('.btn-add').tooltip({
                placement: 'top',
                title: "スキルを追加"
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
            return "スキル「" +　data.language + "」を" + data.weight + "ptに更新しました。";
        },

        removeMsg: function(data) {
            return "スキル「" +　data.language + "(" + data.weight + "pt)」を削除しました。";
        }
    });

    return SkillComposite;
});