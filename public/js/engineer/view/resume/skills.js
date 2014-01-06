define([
    'view/common/composite-base',
    'text!template/resume/skills.html',
    'view/resume/skill',
], function(
    BaseView,
    template,
    ItemView) {

    var SkillComposite = BaseView.extend({

        // template
        template: template,

        // for dnd add class here
        className: 'widget-box transparent',

        // icon
        icon: 'icon-heart',

        // item view container
        itemViewContainer: '.profile-skills',

        // item view
        itemView: ItemView,

        // initializer
        initialize: function() {
            this.events = _.extend({}, this.events, {});
        }
    });

    return SkillComposite;
});