define([
    'employer/view/job/composite-base',
    'text!common/template/profile/languages.html',
    'employer/view/job/language',
    'common/model/language',
], function(
    BaseView,
    template,
    ItemView,
    Language) {

    var Languages = Backbone.Collection.extend({

        model: Language,

        url: function() {
            return this.document.url() + '/languages';
        },

        comparator: function(language) {
            // sort by weight desc
            if (language.get('weight'))
                return 0 - Number(language.get('weight'));
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

        itemName: 'languages',

        // item view
        itemView: ItemView,

        // max item number
        itemLimit: 6,

        // initializer
        initialize: function() {

            // make the collection from user model
            this.collection = new Languages(this.model.get('languages'));
            this.collection.document = this.model;
        },

        // on render
        onRender: function() {

            // add tooltip on add button
            this.$el.find('.btn-add').tooltip({
                placement: 'top',
                title: "語学力を追加"
            });

            // if the collection exceed the limit number
            if (this.collection.length >= this.itemLimit)
                // hide add button
                this.ui.addBtn.hide();
        },

    });
});