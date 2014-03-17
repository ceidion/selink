define([], function() {

    return Backbone.DeepModel.extend({

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
        },

        // Parse data
        parse: function(response, options) {

            // parse date from iso-date to readable format
            if(response.expiredDate) {
                response.expiredDateDisplay = moment(response.expiredDate).format('LL');
                response.expiredDateInput = moment(response.expiredDate).format('L');
            }

            if(response.startDate) {
                response.startDateDisplay = moment(response.startDate).format('LL');
                response.startDateInput = moment(response.startDate).format('L');
            }

            if(response.endDate) {
                response.endDateDisplay = moment(response.endDate).format('LL');
                response.endDateInput = moment(response.endDate).format('L');
            }

            if(response.createDate) {
                response.createDateDisplay = moment(response.createDate).format('LL');
                response.createDateInput = moment(response.createDate).format('L');
            }

            return response;
        }
    });
});