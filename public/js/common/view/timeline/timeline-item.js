define([
    'common/view/composite-base',
    'text!common/template/timeline/timeline-item.html',
    'common/view/timeline/timeline-record'
], function(
    BaseView,
    template,
    ItemView) {

    var ActivitiesModel = Backbone.Collection.extend({

        idAttribute: "_id",

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url: function() {
            return '/activities/' + moment(this.document.get('date')).format('YYYYMMDD');
        }
    });

    return BaseView.extend({

        // template
        template: template,

        className: 'timeline-container',

        // item view container
        itemViewContainer: '.timeline-items',

        // item view
        itemView: ItemView,

        // initializer
        initialize: function() {

            this.events = _.extend({}, this.events);

            this.collection = new ActivitiesModel();
            this.collection.document = this.model;
            this.collection.fetch();
        },

        onRender: function() {

        }
    });

});