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

        url: '/newsfeed?embed=_owner,group,comments._owner',

        model: function(attrs, options) {

            if (_.has(attrs, 'cover'))
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

        // child view
        getChildView: function(item) {

            if (item.has('cover'))
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
        },

        // After show
        onShow: function() {

            var self = this;

            // attach infinite scroll
            this.$el.find(this.childViewContainer).infinitescroll({
                navSelector  : '#page_nav',
                nextSelector : '#page_nav a',
                dataType: 'json',
                appendCallback: false,
                loading: {
                    msgText: '<em>読込み中・・・</em>',
                    finishedMsg: '全部読込みました',
                },
                path: function() {
                    return '/newsfeed?embed=_owner,group,comments._owner&before=' + moment(self.collection.last().get('createDate')).unix();
                }
            }, function(json, opts) {

                // if there are more data
                if (json.length > 0)
                    // add data to collection, don't forget parse the json object
                    // this will trigger 'add' event and will call on
                    self.collection.add(json, {parse: true});
            });

            // call super onShow
            BaseView.prototype.onShow.apply(this);
        }

    });
});