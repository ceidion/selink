define([
    'common/model/base',
    'common/collection/base',
], function(
    BaseModel,
    BaseCollection
) {

    var Comments = BaseCollection.extend({

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
            delete response.comments;

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