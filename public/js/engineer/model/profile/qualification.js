define([], function() {

    var Qualification = Backbone.DeepModel.extend({

        idAttribute: "_id",

        validation: {

            name: {
                maxLength: 50,
                msg: "最大50文字までご入力ください"
            },
            acquireDate: {
                dateJa: true
            }
        }
    });

    return Qualification;
});