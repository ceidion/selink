define([], function() {

    return Backbone.DeepModel.extend({

        idAttribute: "_id",

        validation: {

            language: {
                required: true,
                msg: "言語を選択してください"
            }
        }
    });
});