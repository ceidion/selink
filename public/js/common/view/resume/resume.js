define([
    'text!common/template/resume/resume.html',
    'common/view/resume/photo',
    'common/view/resume/name',
    'common/view/resume/birthday',
    'common/view/resume/gender',
    'common/view/resume/marriage',
    'common/view/resume/nationality',
    'common/view/resume/address',
    'common/view/resume/nearestSt',
    'common/view/resume/experience',
    'common/view/resume/telno',
    'common/view/resume/email',
    'common/view/resume/website',
    'common/view/resume/bio',
    'common/view/resume/languages',
    'common/view/resume/skills',
    'common/view/resume/qualifications',
    'common/view/resume/educations',
    'common/view/resume/employments',
], function(
    template,
    PhotoItem,
    NameItem,
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

    // resume view
    var ResumeView = Backbone.Marionette.Layout.extend({

        // template
        template: template,

        // events
        events: {
            'click': 'closeEditor'
        },

        // regions
        regions: {
            photoRegion: '#photo-item',
            nameRegion: '#name-item',
            birthdayRegion: '#birthday-item',
            genderRegion: '#gender-item',
            marriageRegion: '#marriage-item',
            nationalityRegion: '#nationality-item',
            addressRegion: '#address-item',
            nearestStRegion: '#nearestst-item',
            experienceRegion: '#experience-item',
            telNoRegion: '#telno-item',
            emailRegion: '#email-item',
            webSiteRegion: '#website-item',
            bioRegion: '#bio-item',
            languageRegion: '#language-composite',
            skillRegion: '#skill-composite',
            qualificationRegion: '#qualification-composite',
            educationRegion: '#education-composite',
            employmentRegion: '#employment-composite',
        },

        // initializer
        initialize: function() {
            // create component
            this.photoItem = new PhotoItem({model: this.model});
            this.nameItem = new NameItem({model: this.model});
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
        },

        // after show
        onShow: function() {

            // Portlets (boxes)
            $('.widget-container-span').sortable({
                connectWith: '.widget-container-span',
                items:'> .widget-box',
                opacity:0.8,
                revert:true,
                forceHelperSize:true,
                placeholder: 'widget-placeholder',
                forcePlaceholderSize:true,
                tolerance:'pointer',
                handle: '.btn-handle'
            });

            this.$el.addClass('animated fadeInRight');

            // this.$el.find('.portable').isotope({
            //     itemSelector: '.widget-container-span'
            // })
        },

        // resume view handle the click event
        // -- switch component in editor mode to value mode
        // *from x-editable*
        closeEditor: function(e) {
            var $target = $(e.target), i,
                exclude_classes = ['.editable-container',
                                   '.ui-datepicker-header',
                                   '.datepicker', //in inline mode datepicker is rendered into body
                                   '.modal-backdrop',
                                   '.bootstrap-wysihtml5-insert-image-modal',
                                   '.bootstrap-wysihtml5-insert-link-modal'
                                   ];

            //check if element is detached. It occurs when clicking in bootstrap datepicker
            if (!$.contains(document.documentElement, e.target)) {
              return;
            }

            //for some reason FF 20 generates extra event (click) in select2 widget with e.target = document
            //we need to filter it via construction below. See https://github.com/vitalets/x-editable/issues/199
            //Possibly related to http://stackoverflow.com/questions/10119793/why-does-firefox-react-differently-from-webkit-and-ie-to-click-event-on-selec
            if($target.is(document)) {
               return;
            }

            //if click inside one of exclude classes --> no nothing
            for(i=0; i<exclude_classes.length; i++) {
                 if($target.is(exclude_classes[i]) || $target.parents(exclude_classes[i]).length) {
                     return;
                 }
            }

            //close all open containers (except one - target)
            this.closeOthers(e.target);
        },

        // close all open containers (except one - target)
        closeOthers: function(element) {

            $('.sl-editor-open').each(function(i, el){

                var $el = $(el);

                //do nothing with passed element and it's children
                if(el === element || $el.find(element).length) {
                    return;
                }

                if($el.find('.form-group').hasClass('has-error')) {
                    return;
                }

                // slide up the edit panel
                $el.find('.sl-editor').slideUp('fast', function() {
                    // fadeIn view panel
                    $el.find('.sl-value').fadeIn('fast');
                });

                $el.removeClass('sl-editor-open');
            });
        },
    });

    return ResumeView;
});