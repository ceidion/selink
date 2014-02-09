define([
    'common/view/composite-base',
    'text!common/template/profile/employments.html',
    'common/view/profile/employment',
    'common/collection/employments',
], function(
    BaseView,
    template,
    ItemView,
    EmploymentsModel) {

    var EmploymentComposite = BaseView.extend({

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

            this.collection = new EmploymentsModel(this.model.get('employments'), {parse: true});
            this.collection.document = this.model;

            this.collection.comparator = function(employment) {
                if (employment.get('startDate')) {
                    var date = moment(employment.get('startDate'));
                    return 0 - Number(date.valueOf());
                }
                else 
                    return 0;
            };
            this.collection.sort();
        },

        onRender: function() {

            this.$el.find('.btn-add').tooltip({
                placement: 'top',
                title: "社歴を追加"
            });

            this.$el.find('.btn-sort').tooltip({
                placement: 'top',
                title: "並び替え"
            });

            this.$el.find('.btn-handle').tooltip({
                placement: 'top',
                title: "ドラグして移動"
            });

            if (this.collection.length >= this.itemLimit)
                this.ui.addBtn.hide();

            // bind validator
            Backbone.Validation.bind(this);
        },

        // after show
        onShow: function() {
            this.$el.addClass('animated fadeInRight');
        },

    });

    return EmploymentComposite;
});