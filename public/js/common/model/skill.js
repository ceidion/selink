define([], function() {

    return Backbone.DeepModel.extend({

        idAttribute: "_id",

        validation: {

            skill: [{
                required: true,
                msg: "スキル名をご入力ください"
            },{
                maxLength: 50,
                msg: "最大50文字までご入力ください"
            }]
        }
    });
});