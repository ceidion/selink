define([
    'view/common/composite-base',
    'text!template/resume/languages.html',
    'view/resume/language',
], function(
    BaseView,
    template,
    ItemView) {

    var LanguageComposite = BaseView.extend({

        // template
        template: template,

        // for dnd add class here
        className: 'widget-box transparent',

        // icon
        icon: 'icon-heart',

        // item view container
        itemViewContainer: '.widget-main',

        // item view
        itemView: ItemView,

        // initializer
        initialize: function() {
            this.events = _.extend({}, this.events, {});
        }
    });

    return LanguageComposite;
});