define([], function() {

    return Backbone.DeepModel.extend({

        idAttribute: "_id",

        validation: {

            name: [{
                required: true,
                msg: "資格名をご入力ください"
            },{
                maxLength: 50,
                msg: "最大50文字までご入力ください"
            }],
            acquireDate: {
                dateJa: true
            }
        }
    });
});