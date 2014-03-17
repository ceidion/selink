define([
    'common/view/composite-base',
    'text!common/template/profile/employments.html',
    'common/view/profile/employment',
    'common/model/employment',
], function(
    BaseView,
    template,
    ItemView,
    Employment) {

    var Employments = Backbone.Collection.extend({

        model: Employment,

        url:  function() {
            return this.document.url() + '/employments';
        },

        comparator: function(employment) {
            // sort by startDate desc
            if (employment.get('startDate')) {
                var date = moment(employment.get('startDate'));
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

        itemName: 'employments',

        // item view
        itemView: ItemView,

        // max item number
        itemLimit: 4,

        // initializer
        initialize: function() {

            // make the collection from user model
            this.collection = new Employments(this.model.get('employments'), {parse: true});
            this.collection.document = this.model;
        },

        // on render
        onRender: function() {

            // add tooltip on add button
            this.$el.find('.btn-add').tooltip({
                placement: 'top',
                title: "社歴を追加"
            });

            // if the collection exceed the limit number
            if (this.collection.length >= this.itemLimit)
                // hide add button
                this.ui.addBtn.hide();
        }

    });
});