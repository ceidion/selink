define([
    'text!templates/resume/resume.html',
    'view/resume/photo',
    'view/resume/name',
    'view/resume/birthday',
    'view/resume/gender',
    'view/resume/marriage',
    'view/resume/nationality',
    'view/resume/address',
    'view/resume/nearestSt',
    'view/resume/experience',
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
    ExperienceItem
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
        },

        // initializer
        initialize: function() {
            // create component
            this.photoItem = new PhotoItem({model: this.model});
            this.nameItem = new NameItem();
            this.birthdayItem = new BirthDayItem({model: this.model});
            this.genderItem = new GenderItem({model: this.model});
            this.marriageItem = new MarriageItem({model: this.model});
            this.nationalityItem = new NationalityItem({model: this.model});
            this.addressItem = new AddressItem({model: this.model});
            this.nearestStItem = new NearestStItem({model: this.model});
            this.experienceItem = new ExperienceItem({model: this.model});
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
        },

        // after show
        onShow: function() {

            $('.easy-pie-chart.percentage').each(function(){
            var barColor = $(this).data('color') || '#555';
            var trackColor = '#E2E2E2';
            var size = parseInt($(this).data('size')) || 72;
            $(this).easyPieChart({
                barColor: barColor,
                trackColor: trackColor,
                scaleColor: false,
                lineCap: 'butt',
                lineWidth: parseInt(size/10),
                animate:1000,
                size: size
            }).css('color', barColor);
            });

            // Portlets (boxes)
            $('.widget-container-span').sortable({
                connectWith: '.widget-container-span',
                items:'> .widget-box',
                opacity:0.8,
                revert:true,
                forceHelperSize:true,
                placeholder: 'widget-placeholder',
                forcePlaceholderSize:true,
                tolerance:'pointer'
            });

            this.$el.addClass('animated fadeInRight');
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