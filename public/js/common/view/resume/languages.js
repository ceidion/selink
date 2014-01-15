define([
    'common/view/composite-base',
    'text!common/template/resume/languages.html',
    'common/view/resume/language',
    'common/model/profile/languages',
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

        // icon
        icon: 'icon-comments-alt',

        // item view container
        itemViewContainer: '.widget-main',

        // item view
        itemView: ItemView,

        // max item number
        itemLimit: 6,

        // initializer
        initialize: function() {

            this.events = _.extend({}, this.events);

            this.collection = new LanguagesModel(this.model.get('languages'));
            this.collection.document = this.model;
        },

        onRender: function() {

            this.$el.find('.btn-add').tooltip({
                placement: 'top',
                title: "語学力を追加"
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
            return "語学力「" +　data.language + "」を" + data.weight + "ptに更新しました。";
        },

        removeMsg: function(data) {
            return "語学力「" +　data.language + "(" + data.weight + "pt)」を削除しました。";
        }
    });

    return LanguageComposite;
});