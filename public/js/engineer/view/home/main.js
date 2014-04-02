define([
    'text!engineer/template/home/main.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/model/post',
    'common/Model/job',
    'common/view/post/item',
    'common/view/job/item'
], function(
    template,
    BaseView,
    BaseCollection,
    PostModel,
    JobModel,
    PostItemView,
    JobItemView
) {

    var PostsCollection = BaseCollection.extend({
        url: '/posts',
        model: PostModel
    });

    var JobsCollection = BaseCollection.extend({
        url: '/jobs',
        model: JobModel
    });

    return BaseView.extend({

        // Template
        template: template,

        getItemView: function(item) {

            if (item.collection == this.postsCollection)
                return PostItemView;
            else if (item.collection == this.jobsCollection)
                return JobItemView;
        },

        // Initializer
        initialize: function() {

            var self = this;

            this.collection = new BaseCollection(null, {
                comparator: function(item) {
                    // sort by createDate
                    var date = moment(item.get('createDate'));
                    return Number(date.valueOf());
                }
            });

            this.postsCollection = new PostsCollection();
            this.jobsCollection = new JobsCollection();

            this.postsCollection.fetch({
                success: function(collection, response, options) {
                    self.collection.add(self.postsCollection.models);
                    self.collection.trigger('sync');
                }
            });

            this.jobsCollection.fetch({
                success: function(collection, response, options) {
                    self.collection.add(self.jobsCollection.models);
                    self.collection.trigger('sync');
                    // self.collection.sort();
                    // self.reIsotope();
                }
            });
        }

    });
});