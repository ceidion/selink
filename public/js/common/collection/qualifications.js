define(['common/model/qualification'], function(QualificationModel) {

    var Qualifications = Backbone.Collection.extend({

        idAttribute: "_id",

        // model: Backbone.Model.extend({idAttribute: "_id"}),
        model: QualificationModel,

        url:  function() {
            return this.document.url() + '/qualifications';
        },

        // Parse data
        parse: function(response, options) {

            // parse birth day from iso-date to readable format
            if(response.acquireDate) {
                response.acquireDateDisplay = moment(response.acquireDate).format('YYYY年M月');
                response.acquireDateInput = moment(response.acquireDate).format('L');
            }

            return response;
        }
    });

    return Qualifications;
});