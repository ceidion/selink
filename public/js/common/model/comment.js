define([
    'common/model/base'
], function(
    BaseModel
) {

    return BaseModel.extend({

        // Parse data
        parse: function(response, options) {

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

            return response;
        },

        validation: {
            content: {
                required: true,
                msg: "コメントの中身を入力しよう！"
            }
        }

    });
});