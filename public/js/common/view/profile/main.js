define([
    'text!common/template/profile/main.html',
    'common/view/profile/photo',
    'common/view/profile/name',
    'common/view/profile/completeness',
    'common/view/profile/title',
    'common/view/profile/birthday',
    'common/view/profile/gender',
    'common/view/profile/marriage',
    'common/view/profile/nationality',
    'common/view/profile/address',
    'common/view/profile/nearestSt',
    'common/view/profile/experience',
    'common/view/profile/telno',
    'common/view/profile/email',
    'common/view/profile/website',
    'common/view/profile/bio',
    'common/view/profile/languages',
    'common/view/profile/skills',
    'common/view/profile/qualifications',
    'common/view/profile/educations',
    'common/view/profile/employments',
], function(
    template,
    PhotoItem,
    NameItem,
    CompletenessItem,
    TitleItem,
    BirthDayItem,
    GenderItem,
    MarriageItem,
    NationalityItem,
    AddressItem,
    NearestStItem,
    ExperienceItem,
    TelNoItem,
    EMailItem,
    WebSiteItem,
    BioItem,
    LanguageComposite,
    SkillComposite,
    QualificationComposite,
    EducationComposite,
    EmploymentComposite
) {

    // profile view
    return Backbone.Marionette.Layout.extend({

        // template
        template: template,

        // regions
        regions: {
            photoRegion: '#photo',
            nameRegion: '#name',
            completenessRegion: '#completeness',
            titleRegion: '#title',
            birthdayRegion: '#birthday',
            genderRegion: '#gender',
            marriageRegion: '#marriage',
            nationalityRegion: '#nationality',
            addressRegion: '#address',
            nearestStRegion: '#nearestst',
            experienceRegion: '#experience',
            telNoRegion: '#telno',
            emailRegion: '#email',
            webSiteRegion: '#website',
            bioRegion: '#bio',
            languageRegion: '#languages',
            skillRegion: '#skills',
            qualificationRegion: '#qualifications',
            educationRegion: '#educations',
            employmentRegion: '#employments',
        },

        // initializer
        initialize: function() {
            // create component
            this.photoItem = new PhotoItem({model: this.model});
            this.nameItem = new NameItem({model: this.model});
            this.completenessItem = new CompletenessItem({model: this.model});
            this.titleItem = new TitleItem({model: this.model});
            this.birthdayItem = new BirthDayItem({model: this.model});
            this.genderItem = new GenderItem({model: this.model});
            this.marriageItem = new MarriageItem({model: this.model});
            this.nationalityItem = new NationalityItem({model: this.model});
            this.addressItem = new AddressItem({model: this.model});
            this.nearestStItem = new NearestStItem({model: this.model});
            this.experienceItem = new ExperienceItem({model: this.model});
            this.telNoItem = new TelNoItem({model: this.model});
            this.emailItem = new EMailItem({model: this.model});
            this.webSiteItem = new WebSiteItem({model: this.model});
            this.bioItem = new BioItem({model: this.model});
            this.languageComposite = new LanguageComposite({model: this.model});
            this.skillComposite = new SkillComposite({model: this.model});
            this.qualificationComposite = new QualificationComposite({model: this.model});
            this.educationComposite = new EducationComposite({model: this.model});
            this.employmentComposite = new EmploymentComposite({model: this.model});
        },

        // after render
        onRender: function() {
            // show every component
            this.photoRegion.show(this.photoItem);
            this.nameRegion.show(this.nameItem);
            this.completenessRegion.show(this.completenessItem);
            this.titleRegion.show(this.titleItem);
            this.birthdayRegion.show(this.birthdayItem);
            this.genderRegion.show(this.genderItem);
            this.marriageRegion.show(this.marriageItem);
            this.nationalityRegion.show(this.nationalityItem);
            this.addressRegion.show(this.addressItem);
            this.nearestStRegion.show(this.nearestStItem);
            this.experienceRegion.show(this.experienceItem);
            this.telNoRegion.show(this.telNoItem);
            this.emailRegion.show(this.emailItem);
            this.webSiteRegion.show(this.webSiteItem);
            this.bioRegion.show(this.bioItem);
            this.languageRegion.show(this.languageComposite);
            this.skillRegion.show(this.skillComposite);
            this.qualificationRegion.show(this.qualificationComposite);
            this.educationRegion.show(this.educationComposite);
            this.employmentRegion.show(this.employmentComposite);

            Backbone.Validation.bind(this);
        },

        // after show
        onShow: function() {
            this.$el.addClass('animated fadeInRight');
        }
    });
});