define([
    'text!employer/template/home/main.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/model/job',
    'common/model/post',
    'common/view/post/item',
    'common/view/job/item'
], function(
    template,
    BaseView,
    BaseCollection,
    JobModel,
    PostModel,
    PostItemView,
    JobItemView
) {

    var NewsFeedCollection = BaseCollection.extend({

        url: '/newsfeed',

        model: function(attrs, options) {

            if (_.has(attrs, 'expiredDate')) {
                return new JobModel(attrs, options);
            } else {
                return new PostModel(attrs, options);
            }
        },

        comparator: function(item) {
            // sort by createDate
            var date = moment(item.get('createDate'));
            return 0 - Number(date.valueOf());
        }
    });

    return BaseView.extend({

        // Template
        template: template,

        // item view
        getItemView: function(item) {

            if (item.has('expiredDate'))
                return JobItemView;
            else
                return PostItemView;
        },

        // Initializer
        initialize: function() {

            this.collection = new NewsFeedCollection();

            // call super initializer
            BaseView.prototype.initialize.apply(this);
        }

    });
});