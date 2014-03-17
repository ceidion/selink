define([
    'common/view/composite-base',
    'text!common/template/profile/educations.html',
    'common/view/profile/education',
    'common/model/education',
], function(
    BaseView,
    template,
    ItemView,
    Education) {

    var Educations = Backbone.Collection.extend({

        model: Education,

        url:  function() {
            return this.document.url() + '/educations';
        },

        comparator: function(education) {
            // sort by startDate desc
            if (education.get('startDate')) {
                var date = moment(education.get('startDate'));
                return 0 - Number(date.valueOf());
            }
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

        itemName: 'educations',

        // item view
        itemView: ItemView,

        // max item number
        itemLimit: 4,

        // initializer
        initialize: function() {

            // make the collection from user model
            this.collection = new Educations(this.model.get('educations'), {parse: true});
            this.collection.document = this.model;
        },

        // on render
        onRender: function() {

            // add tooltip on add button
            this.$el.find('.btn-add').tooltip({
                placement: 'top',
                title: "学歴を追加"
            });

            // if the collection exceed the limit number
            if (this.collection.length >= this.itemLimit)
                // hide add button
                this.ui.addBtn.hide();
        },

    });
});