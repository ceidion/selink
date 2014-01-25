define([], function() {

    var Skill = Backbone.DeepModel.extend({

        idAttribute: "_id",

        validation: {

            skill: {
                maxLength: 20,
                msg: "最大20文字までご入力ください"
            }
        }
    });

    return Skill;
});