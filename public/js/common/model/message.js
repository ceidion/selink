define([], function() {

    return Backbone.DeepModel.extend({

        idAttribute: "_id",

        validation: {
            subject: {
                required: true,
                msg: "メッセージタイトルをご入力ください"
            }
        },

        // Parse data
        parse: function(response, options) {

            // parse date from ISO8601 date to javascript date
            // if(response.start) {
            //     response.start = moment(response.start).toDate();
            // }

            // if(response.end) {
            //     response.end = moment(response.end).toDate();
            // }

            return response;
        }
    });
});