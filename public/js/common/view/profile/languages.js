define([
    'common/view/composite-base',
    'text!common/template/profile/languages.html',
    'common/view/profile/language',
    'common/collection/languages',
], function(
    BaseView,
    template,
    ItemView,
    LanguagesModel) {

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
        itemLimit: 6,

        // initializer
        initialize: function() {

            this.events = _.extend({}, this.events);

            // make the collection from user model
            this.collection = new LanguagesModel(this.model.get('languages'));
            this.collection.document = this.model;

            // collection comparator
            this.collection.comparator = function(language) {
                // sort by weight desc
                if (language.get('weight'))
                    return 0 - Number(language.get('weight'));
                else
                    return 0;
            };
            // sort collection
            this.collection.sort();
        },

        // on render
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

            // if the collection exceed the limit number
            if (this.collection.length >= this.itemLimit)
                // hide add button
                this.ui.addBtn.hide();
        },

    });
});