define([
    'common/view/composite-base',
    'text!common/template/profile/skills.html',
    'common/view/profile/skill',
    'common/model/skill',
], function(
    BaseView,
    template,
    ItemView,
    Skill) {

    var Skills = Backbone.Collection.extend({

        model: Skill,

        url:  function() {
            return this.document.url() + '/skills';
        },

        comparator: function(skill) {
            // sort by weight desc
            if (skill.get('weight'))
                return 0 - Number(skill.get('weight'));
            else
                return 0;
        }
    });

    return BaseView.extend({

        // template
        template: template,

        // className
        className: 'widget-box transparent',

        // item view container
        itemViewContainer: '.widget-main',

        // item view
        itemView: ItemView,

        // max item number
        itemLimit: 8,

        // initializer
        initialize: function() {

            // make the collection from user model
            this.collection = new Skills(this.model.get('skills'));
            this.collection.document = this.model;
        },

        // on render
        onRender: function() {

            // add tooltip on add button
            this.$el.find('.btn-add').tooltip({
                placement: 'top',
                title: "スキルを追加"
            });

            // if the collection exceed the limit number
            if (this.collection.length >= this.itemLimit)
                // hide add button
                this.ui.addBtn.hide();
        }

    });
});