define([
    'common/model/base',
    'common/collection/base',
    'common/model/comment'
], function(
    BaseModel,
    BaseCollection,
    CommentModel
) {

    var Comments = BaseCollection.extend({

        model: CommentModel,

        url: function() {
            return '/posts/' + this.document.id + '/comments';
        },

        comparator: function(comment) {
            // sort by createDate
            var date = moment(comment.get('createDate'));
            return Number(date.valueOf());
        }
    });

    return BaseModel.extend({

        // Url root
        urlRoot: '/posts',

        // Constructor
        constructor: function() {

            // create comments collection inside model
            this.comments = new Comments(null, {document: this});

            // call super constructor
            Backbone.Model.apply(this, arguments);
        },

        // Parse data
        parse: function(response, options) {

            // populate comments collection
            this.comments.set(response.comments, {parse: true, remove: false});
            // set comment num
            response.commentNum = response.comments.length;

            delete response.comments;

            // if the post owner's id is user id
            if (response._owner._id === selink.userModel.id)
                // mark as my post
                response.isMine = true;
            else
                response.isMine = false;

            // if user's id exists in post's liked list
            if (_.indexOf(response.liked, selink.userModel.id) >= 0)
                // mark as liked
                response.isLiked = true;
            else
                response.isLiked = false;

            // if user's id exists in post's bookmark list
            if (_.indexOf(response.bookmarked, selink.userModel.id) >= 0)
                // mark as marked
                response.isMarked = true;
            else
                response.isMarked = false;

            return response;
        },

        validation: {
            content: {
                required: true,
                msg: "記事の中身を入力しよう！"
            }
        }

    });
});