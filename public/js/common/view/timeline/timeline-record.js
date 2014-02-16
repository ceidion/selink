define([
    'common/view/item-base',
    'text!common/template/timeline/timeline-record.html',
], function(
    BaseView,
    template) {

    return BaseView.extend({

        // template
        template: template,

        className: 'timeline-item clearfix',

        // initializer
        initialize: function() {
            this.events = _.extend({}, this.events);
        },

        onRender: function() {
        }
    });

});