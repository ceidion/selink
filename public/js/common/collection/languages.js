define(['common/model/language'], function(LanguageModel) {

    var Languages = Backbone.Collection.extend({

        idAttribute: "_id",

        model: LanguageModel,

        url: function() {
            return this.document.url() + '/languages';
        }
    });

    return Languages;
});