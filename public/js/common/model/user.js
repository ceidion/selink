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
        },

        completeness: function() {

            var completeness = 0;

            if (this.get('photo') && this.get('photo') != "./asset/images/no_photo_male.gif")
                completeness += 10;

            if (this.get('firstName'))
                completeness += 5;

            if (this.get('lastName'))
                completeness += 5;

            if (this.get('birthDay'))
                completeness += 5;

            if (this.get('gender'))
                completeness += 5;

            if (this.get('nationality'))
                completeness += 5;

            if (this.get('marriage'))
                completeness += 5;

            if (this.get('experience'))
                completeness += 5;

            if (this.get('telNo'))
                completeness += 5;

            if (this.get('secEmail'))
                completeness += 5;

            if (this.get('webSite'))
                completeness += 5;

            if (this.get('nearestSt'))
                completeness += 5;

            if (this.get('address'))
                completeness += 5;

            if (this.get('bio'))
                completeness += 5;

            if (this.get('qualifications').length)
                completeness += 5;

            if (this.get('languages').length)
                completeness += 5;

            if (this.get('skills').length)
                completeness += 5;

            if (this.get('educations').length)
                completeness += 5;

            if (this.get('employments').length)
                completeness += 5;

            return completeness;
        }
    });
});