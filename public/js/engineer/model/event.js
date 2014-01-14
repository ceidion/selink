define([], function() {

    var Event = Backbone.DeepModel.extend({

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

    return Event;
});