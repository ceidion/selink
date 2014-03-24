define([
    'text!employer/template/job/item.html'
], function(
    template) {

    return Backbone.Marionette.ItemView.extend({

        // template
        template: template,

        className: 'job-item col-xs-12 col-sm-6 col-lg-4',

        events: {
            'click .btn-edit': 'editJob'
        },

        // initializer
        initialize: function() {

        },

        editJob: function(event) {
            event.preventDefault();
            this.trigger('edit');
        }

    });
});