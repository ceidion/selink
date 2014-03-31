define([
    'common/model/base',
    'common/collection/base',
    'common/model/language',
    'common/model/skill'
], function(
    BaseModel,
    BaseCollection,
    LanguageModel,
    SkillModel
) {

    // Languages Collection
    var Languages = BaseCollection.extend({

        model: LanguageModel,

        url: function() {
            return this.document.url() + '/languages';
        },

        comparator: function(language) {
            // sort by weight desc
            if (language.get('weight'))
                return 0 - Number(language.get('weight'));
            else
                return 0;
        }
    });

    // Skills Collection
    var Skills = BaseCollection.extend({

        model: SkillModel,

        url:  function() {
            return this.document.url() + '/skills';
        },

        comparator: function(skill) {
            // sort by weight desc
            if (skill.get('weight'))
                return 0 - Number(skill.get('weight'));
            else
                return 0;
        }
    });

    return BaseModel.extend({

        // Constructor
        constructor: function() {

            // create languages collection inside model
            this.languages = new Languages(null, {document: this});

            // create skills collection inside model
            this.skills = new Skills(null, {document: this});

            // call super constructor
            Backbone.Model.apply(this, arguments);
        },

        // Parse data
        parse: function(response, options) {

            // populate languages collection
            this.languages.set(response.languages, {parse: true, remove: false});
            delete response.languages;

            // populate skills collection
            this.skills.set(response.skills, {parse: true, remove: false});
            delete response.skills;

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
        },

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
                required: true,
                datetimeJa: true
            },
            startDate: {
                required: false,
                dateJa: true
            },
            endDate: {
                required: false,
                dateJa: true
            }
        }

    });
});