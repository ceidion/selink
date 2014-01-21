define([
    'text!employer/template/job/edit.html',
    'employer/view/job/name',
    'employer/view/job/address',
    'employer/view/job/expiredDate',
    'employer/view/job/duration',
    'employer/view/job/price',
    'employer/view/job/recruit',
    'employer/view/job/interview',
    'employer/view/job/native',
    'employer/view/job/remark',
], function(
    template,
    NameView,
    AddressView,
    ExpiredDateView,
    DurationView,
    PriceView,
    RecruitView,
    InterviewView,
    NativeView,
    RemarkView
) {

    var JobEditView = Backbone.Marionette.Layout.extend({

        // template
        template: template,

        // events
        events: {
            'click': 'closeEditor'
        },

        regions: {
            nameRegion: '#name-item',
            addressRegion: '#address-item',
            expiredDateRegion: '#expired-item',
            durationRegion: '#duration-item',
            priceRegion: '#price-item',
            recruitRegion: '#recruit-item',
            interviewRegion: '#interview-item',
            nativeRegion: '#native-item',
            remarkRegion: '#remark-item',
        },

        // initializer
        initialize: function() {
            this.nameItem = new NameView({model: this.model});
            this.addressItem = new AddressView({model: this.model});
            this.expiredDateItem = new ExpiredDateView({model: this.model});
            this.durationItem = new DurationView({model: this.model});
            this.priceItem = new PriceView({model: this.model});
            this.recruitItem = new RecruitView({model: this.model});
            this.interviewItem = new InterviewView({model: this.model});
            this.nativeItem = new NativeView({model: this.model});
            this.remarkItem = new RemarkView({model: this.model});
        },

        // after render
        onRender: function() {
            this.nameRegion.show(this.nameItem);
            this.addressRegion.show(this.addressItem);
            this.expiredDateRegion.show(this.expiredDateItem);
            this.durationRegion.show(this.durationItem);
            this.priceRegion.show(this.priceItem);
            this.recruitRegion.show(this.recruitItem);
            this.interviewRegion.show(this.interviewItem);
            this.nativeRegion.show(this.nativeItem);
            this.remarkRegion.show(this.remarkItem);
        },

        // profile view handle the click event
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
        }
    });

    return JobEditView;
});