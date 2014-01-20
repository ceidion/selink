define([
    'common/view/composite-base',
    'text!employer/template/job/index.html',
    'employer/view/job/widget'
], function(
    BaseView,
    template,
    ItemView
) {

    var IndexView = BaseView.extend({

        // Template
        template: template,

        // item view container
        itemViewContainer: '.job-container',

        // item view
        itemView: ItemView,

        // max item number
        itemLimit: 10,

        // Initializer
        initialize: function() {

            this.events = _.extend({}, this.events);

            this.collectionEvents = _.extend({}, this.collectionEvents, {
                'add': 'showEditPage'
            });
        },

        // override: we need to navigate to job editor
        addItem: function() {
            // add a new job to collection, and wait until server response
            var newJob = this.collection.create({}, {wait: true});
        },

        // once new job added, move to the editor of this job
        showEditPage: function(model) {
            window.location = '#jobEdit/' + model.get('_id');
        }

    });

    return IndexView;
});