define([], function() {

    return Backbone.DeepModel.extend({

        idAttribute: "_id",

        // urlRoot: '/jobs',

        validation: {
            name: [{
                required: true,
                msg: "案件名称をご入力ください"
            },{
                maxLength: 50,
                msg: "最大50文字までご入力ください"
            }],
            address: {
                maxLength: 100,
                msg: "最大100文字までご入力ください"
            },
            expiredDate: {
                required: false,
                dateJa: true
            },
            startDate: {
                required: false,
                dateJa: true
            },
            endDate: {
                required: false,
                dateJa: true
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

            if(response.recruitNum) {
                response.recruitNumDisplay = response.recruitNumInput = response.recruitNum + "人";
            }

            return response;
        }
    });
});