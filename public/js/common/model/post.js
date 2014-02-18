define([], function() {

    return Backbone.DeepModel.extend({

        idAttribute: "_id",

        validation: {
            content: {
                required: true,
                msg: "記事の中身を入力しよう！"
            }
        }

    });
});