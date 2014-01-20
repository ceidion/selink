define([
    'common/view/composite-base',
    'text!common/template/resume/skills.html',
    'common/view/resume/skill',
    'common/collection/skills',
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
        }

    });

    return SkillComposite;
});