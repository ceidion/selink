define([], function() {

    return Backbone.DeepModel.extend({

        idAttribute: "_id",

        validation: {

            skill: [{
                required: true,
                msg: "スキル名をご入力ください"
            },{
                maxLength: 20,
                msg: "最大20文字までご入力ください"
            }]
        }
    });
});