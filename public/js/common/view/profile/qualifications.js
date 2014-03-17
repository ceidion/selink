define([
    'common/view/composite-base',
    'text!common/template/profile/qualifications.html',
    'common/view/profile/qualification',
    'common/model/qualification',
], function(
    BaseView,
    template,
    ItemView,
    Qualification) {

    var Qualifications = Backbone.Collection.extend({

        model: Qualification,

        url:  function() {
            return this.document.url() + '/qualifications';
        },

        comparator: function(qualification) {
            // sort by acquireDate desc
            if (qualification.get('acquireDate')) {
                var date = moment(qualification.get('acquireDate'));
                return 0 - Number(date.valueOf());
            }
            else return 0;
        }
    });

    return BaseView.extend({

        // template
        template: template,

        // className
        className: 'widget-box transparent',

        // item view container
        itemViewContainer: '.widget-main',

        // item view
        itemView: ItemView,

        // max item number
        itemLimit: 4,

        // initializer
        initialize: function() {

            // make the collection from user model
            this.collection = new Qualifications(this.model.get('qualifications'));
            this.collection.document = this.model;
        },

        // on render
        onRender: function() {

            // add tooltip on add button
            this.$el.find('.btn-add').tooltip({
                placement: 'top',
                title: "資格を追加"
            });

            // if the collection exceed the limit number
            if (this.collection.length >= this.itemLimit)
                // hide add button
                this.ui.addBtn.hide();
        }
    });
});