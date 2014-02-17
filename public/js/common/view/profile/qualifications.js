define([
    'common/view/composite-base',
    'text!common/template/profile/qualifications.html',
    'common/view/profile/qualification',
    'common/collection/qualifications',
], function(
    BaseView,
    template,
    ItemView,
    QualificationsModel) {

    return BaseView.extend({

        // template
        template: template,

        // for dnd add class here
        className: 'widget-box transparent',

        // item view container
        itemViewContainer: '.widget-main',

        // item view
        itemView: ItemView,

        // max item number
        itemLimit: 4,

        // initializer
        initialize: function() {

            this.events = _.extend({}, this.events);

            // make the collection from user model
            this.collection = new QualificationsModel(this.model.get('qualifications'), {parse: true});
            this.collection.document = this.model;

            // collection comparator
            this.collection.comparator = function(qualification) {
                // sort by acquireDate desc
                if (qualification.get('acquireDate')) {
                    var date = moment(qualification.get('acquireDate'));
                    return 0 - Number(date.valueOf());
                }
                else return 0;
            };
            // sort collection
            this.collection.sort();
        },

        // on render
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

            // if the collection exceed the limit number
            if (this.collection.length >= this.itemLimit)
                // hide add button
                this.ui.addBtn.hide();
        }
    });
});