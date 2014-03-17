define([], function() {

    return Backbone.DeepModel.extend({

        idAttribute: "_id",

        urlRoot: '/users',

        validation: {
            firstName: [{
                required: true,
                msg: "氏名をご入力ください"
            },{
                maxLength: 20,
                msg: "最大20文字までご入力ください"
            }],
            lastName: {
                maxLength: 20,
                msg: "最大20文字までご入力ください"
            },
            title: {
                maxLength: 20,
                msg: "最大20文字までご入力ください"
            },
            birthDay: {
                required: false,
                dateJa: true
            },
            address: {
                required: false,
                maxLength: 80,
                msg: "最大80文字までご入力ください"
            },
            nearestSt: {
                required: false,
                maxLength: 30,
                msg: "最大30文字までご入力ください"
            },
            secEmail: {
                required: false,
                pattern: 'email',
                msg: "正しいフォーマットでご入力ください"
            },
            webSite: {
                required: false,
                pattern: 'url',
                msg: "正しいURLフォーマットでご入力ください"
            }
        },

        // Parse data
        parse: function(response, options) {

            // parse birth day from iso-date to readable format
            if(response.birthDay) {
                response.birthDayDisplay = moment(response.birthDay).format('LL');
                response.birthDayInput = moment(response.birthDay).format('L');
            }

            return response;
        }
    });
});