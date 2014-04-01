define(['common/model/base'], function(BaseModel) {

    return BaseModel.extend({

        // Url root
        urlRoot: '/posts',

        validation: {
            content: {
                required: true,
                msg: "記事の中身を入力しよう！"
            }
        }

    });
});