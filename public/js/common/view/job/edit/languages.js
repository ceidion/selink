define([
    'common/view/job/composite-base',
    'text!common/template/profile/languages.html',
    'common/view/job/edit/language'
], function(
    BaseView,
    template,
    ItemView
) {

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
            this.collection = this.model.languages;
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