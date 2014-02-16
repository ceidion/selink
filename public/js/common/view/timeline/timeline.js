define([
    'common/view/composite-base',
    'text!common/template/timeline/timeline.html',
    'common/view/timeline/timeline-item'
], function(
    BaseView,
    template,
    ItemView) {

    return BaseView.extend({

        // template
        template: template,

        // for dnd add class here
        className: 'widget-box transparent',

        // item view container
        itemViewContainer: '.timeline-block',

        // item view
        itemView: ItemView,

        // initializer
        initialize: function() {

            this.events = _.extend({}, this.events);

            var models = [
                new Backbone.Model({date: moment()}),
                new Backbone.Model({date: moment().subtract('days', 1)}),
                new Backbone.Model({date: moment().subtract('days', 2)})
            ];

            this.collection = new Backbone.Collection(models);
        },

        onRender: function() {

        }
    });

});