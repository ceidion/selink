define([
    'text!employer/template/job/main.html',
    'employer/view/job/widget'
], function(
    template,
    ItemView
) {

    var JobCollection = Backbone.Collection.extend({

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url: function() {
            return this.document.url() + '/jobs';
        }
    });

    return Backbone.Marionette.CompositeView.extend({

        // Template
        template: template,

        // item view container
        itemViewContainer: '.job-container',

        // item view
        itemView: ItemView,

        events: {
            'click .btn-add': 'showCreateView'
        },

        // Initializer
        initialize: function() {

            this.collection = new JobCollection();
            this.collection.document = this.model;

            this.collection.fetch();
        },

        showCreateView: function() {
            window.location = '#job/create';
        },

        // once new job added, move to the editor of this job
        showEditPage: function(model) {
            window.location = '#jobEdit/' + model.get('_id');
        }

    });
});