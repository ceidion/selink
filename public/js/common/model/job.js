define([], function() {

    var Job = Backbone.DeepModel.extend({

        idAttribute: "_id",

        validation: {
            title: {
                required: true,
                msg: "イベントのタイトルをご入力ください"
            },
            startDate: {
                dateJa: true
            },
            endDate: {
                dateJa: true
            }
        }
    });

    return Job;
});