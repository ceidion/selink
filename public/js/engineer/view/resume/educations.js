define([
    'view/common/composite-base',
    'text!template/resume/educations.html',
    'view/resume/education',
    'model/profile/educations',
], function(
    BaseView,
    template,
    ItemView,
    EducationsModel) {

    var EducationComposite = BaseView.extend({

        // template
        template: template,

        // for dnd add class here
        className: 'widget-box transparent',

        // icon
        icon: 'icon-pencil',

        // item view container
        itemViewContainer: '.widget-main',

        // item view
        itemView: ItemView,

        // max item number
        itemLimit: 4,

        // initializer
        initialize: function() {

            this.events = _.extend({}, this.events);

            this.collection = new EducationsModel(this.model.get('educations'), {parse: true});
            this.collection.document = this.model;
        },

        onRender: function() {

            this.$el.find('.btn-add').tooltip({
                placement: 'top',
                title: "学歴を追加"
            });

            this.$el.find('.btn-sort').tooltip({
                placement: 'top',
                title: "並び替え"
            });

            this.$el.find('.btn-handle').tooltip({
                placement: 'top',
                title: "ドラグして移動"
            });

            // bind validator
            Backbone.Validation.bind(this);
        },

        updateMsg: function(data) {
            return "学歴「" +　data.language + "」を" + data.weight + "ptに更新しました。";
        },

        removeMsg: function(data) {
            return "学歴「" +　data.language + "(" + data.weight + "pt)」を削除しました。";
        }
    });

    return EducationComposite;
});