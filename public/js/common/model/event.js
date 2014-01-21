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
        },

        // Parse data
        parse: function(response, options) {

            // parse date from ISO8601 date to javascript date
            if(response.start) {
                response.start = moment(response.start).toDate();
            }

            if(response.end) {
                response.end = moment(response.end).toDate();
            }

            return response;
        }
    });

    return Event;
});