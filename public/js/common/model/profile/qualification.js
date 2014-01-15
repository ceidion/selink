define([], function() {

    var Qualification = Backbone.DeepModel.extend({

        idAttribute: "_id",

        validation: {

            name: {
                maxLength: 50,
                msg: "最大50文字までご入力ください"
            },
            acquireDate: {
                dateJa: true
            }
        },

        // Parse data
        parse: function(response, options) {

            // parse acquireDatefrom iso-date to readable format
            if(response.acquireDate) {
                response.acquireDateDisplay = moment(response.acquireDate).format('YYYY年M月');
                response.acquireDateInput = moment(response.acquireDate).format('YYYY/MM');
            }

            return response;
        }
    });

    return Qualification;
});