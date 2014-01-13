define([], function() {

    var Profile = Backbone.DeepModel.extend({

        idAttribute: "_id",

        urlRoot: '/profile',

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

    return Profile;

});