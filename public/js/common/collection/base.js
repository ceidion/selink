define(['common/model/base'], function(BaseModel) {

    return Backbone.Collection.extend({

        // adapt mongodb document
        model: BaseModel,

        initialize: function(models, options) {
            this.document = options.document;
        }

    });
});