define([
    'common/model/base',
    'common/collection/base',
    'common/model/comment'
], function(
    BaseModel,
    BaseCollection,
    CommentModel
) {

    return BaseModel.extend({

        // Url root
        urlRoot: '/groups',

        // Constructor
        constructor: function() {
            // call super constructor
            Backbone.Model.apply(this, arguments);
        },

        // Parse data
        parse: function(response, options) {
            return response;
        },

        validation: {
            name: {
                required: true,
                msg: "グループの名称を入力しよう！"
            }
        }

    });
});