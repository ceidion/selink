define([
    'view/common/composite-base',
    'text!template/resume/qualifications.html',
    'view/resume/qualification',
    'model/profile/qualifications',
], function(
    BaseView,
    template,
    ItemView,
    QualificationsModel) {

    var QualificationComposite = BaseView.extend({

        // template
        template: template,

        // for dnd add class here
        className: 'widget-box transparent',

        // icon
        icon: 'icon-ticket',

        // item view container
        itemViewContainer: '.widget-main',

        // item view
        itemView: ItemView,

        // max item number
        itemLimit: 8,

        // initializer
        initialize: function() {

            this.events = _.extend({}, this.events);

            this.collection = new QualificationsModel(this.model.get('qualifications'));
            this.collection.document = this.model;
        },

        onRender: function() {

            this.$el.find('.btn-add').tooltip({
                placement: 'top',
                title: "資格を追加"
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
            return "資格「" +　data.language + "」を" + data.weight + "ptに更新しました。";
        },

        removeMsg: function(data) {
            return "資格「" +　data.language + "(" + data.weight + "pt)」を削除しました。";
        }
    });

    return QualificationComposite;
});