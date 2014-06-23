define([
    'text!employer/template/home/main.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/model/base',
    'common/model/job',
    'common/model/post',
    'common/model/group',
    'common/view/post/item',
    'common/view/announcement/item',
    'common/view/job/item',
    'common/view/group/item'
], function(
    template,
    BaseView,
    BaseCollection,
    BaseModel,
    JobModel,
    PostModel,
    GroupModel,
    PostItemView,
    AnnouncementItemView,
    JobItemView,
    GroupItemView
) {

    var NewsFeedCollection = BaseCollection.extend({

        url: '/newsfeed',

        model: function(attrs, options) {

            if (_.has(attrs, 'description'))
                return new GroupModel(attrs, options);
            else if (_.has(attrs, 'name'))
                return new JobModel(attrs, options);
            else if (_.has(attrs, 'title'))
                return new BaseModel(attrs, options);
            else
                return new PostModel(attrs, options);
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

            if (item.has('description'))
                return GroupItemView;
            else if (item.has('name'))
                return JobItemView;
            else if (item.has('title'))
                return AnnouncementItemView;
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