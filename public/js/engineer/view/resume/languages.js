define([
    'view/common/composite-base',
    'text!template/resume/languages.html',
    'view/resume/language',
    'model/profile/languages',
], function(
    BaseView,
    template,
    ItemView,
    LanguagesModel) {

    var LanguageComposite = BaseView.extend({

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
            this.collection = new LanguagesModel(this.model.get('languages'));
            this.collection.document = this.model;
        }
    });

    return LanguageComposite;
});