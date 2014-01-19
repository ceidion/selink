define([], function() {

    var Job = Backbone.DeepModel.extend({

        idAttribute: "_id",

        validation: {
            name: {
                maxLength: 50,
                msg: "最大50文字までご入力ください"
            },
            address: {
                maxLength: 100,
                msg: "最大100文字までご入力ください"
            }
        }
    });

    return Job;
});