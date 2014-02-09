define([
    'common/view/composite-base',
    'text!common/template/profile/skills.html',
    'common/view/profile/skill',
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

            this.collection.comparator = function(skill) {
                if (skill.get('weight'))
                    return 0 - Number(skill.get('weight'));
                else 
                    return 0;
            };
            this.collection.sort();
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
            
            if (this.collection.length >= this.itemLimit)
                this.ui.addBtn.hide();

            // bind validator
            Backbone.Validation.bind(this);
        },

    });

    return SkillComposite;
});