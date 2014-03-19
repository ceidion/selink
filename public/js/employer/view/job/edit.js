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
    'common/model/job'
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
    RemarkView,
    JobModel
) {

    return Backbone.Marionette.Layout.extend({

        // template
        template: template,

        // regions
        regions: {
            nameRegion: '#name',
            addressRegion: '#address',
            expiredDateRegion: '#expired',
            durationRegion: '#duration',
            priceRegion: '#price',
            recruitRegion: '#recruit',
            interviewRegion: '#interview',
            nativeRegion: '#native',
            remarkRegion: '#remark',
        },

        // initializer
        initialize: function() {

            this.model = new JobModel();

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
        }

    });
});