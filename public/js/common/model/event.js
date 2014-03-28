define(['common/model/base'], function(BaseModel) {

    return BaseModel.extend({

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
            },
            fee: {
                range: [1, 10000],
                msg: "交通費は10000円以下でご入力ください"
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
});