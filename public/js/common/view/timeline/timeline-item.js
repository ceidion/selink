define([
    'common/view/composite-base',
    'text!common/template/timeline/timeline-item.html',
    'common/view/timeline/timeline-record'
], function(
    BaseView,
    template,
    ItemView) {

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

            this.collection = new Backbone.Collection(this.model.get('activities'));
        },

        onRender: function() {

        }
    });

});