define(['common/model/skill'], function(SkillModel) {

    var Skills = Backbone.Collection.extend({

        idAttribute: "_id",

        model: SkillModel,

        url:  function() {
            return this.document.url() + '/skills';
        }
    });

    return Skills;
});