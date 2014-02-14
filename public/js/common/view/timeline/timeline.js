define([
    'common/view/composite-base',
    'text!common/template/timeline/timeline.html',
], function(
    BaseView,
    template) {

    return BaseView.extend({

        // template
        template: template,

        // for dnd add class here
        className: 'row',

        // item view container
        itemViewContainer: '.timeline-container',

        // item view
        // itemView: ItemView,

        // initializer
        initialize: function() {

            var self = this;

            this.events = _.extend({}, this.events);

        },

        onRender: function() {

        }
    });

});