define([
    'common/view/item-base',
    'text!common/template/profile/photo.html'
], function(
    BaseView,
    template) {

    return BaseView.extend({

        // template
        template: template,

        modelEvents: {
            'change:photo': 'updatePhoto',
            'change': 'updateCompleteness'
        },

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                photo: 'img',
                inputFile: 'input[type="file"]',
                progress: '.progress',
                bar: '.progress-bar'
            });

            this.model.set({'completeness': this.model.completeness()}, {silent: true});

            this.listenTo(this.model.qualifications, 'change', this.updateCompleteness);
            this.listenTo(this.model.qualifications, 'remove', this.updateCompleteness);

            this.listenTo(this.model.languages, 'change', this.updateCompleteness);
            this.listenTo(this.model.languages, 'remove', this.updateCompleteness);

            this.listenTo(this.model.skills, 'change', this.updateCompleteness);
            this.listenTo(this.model.skills, 'remove', this.updateCompleteness);

            this.listenTo(this.model.educations, 'change', this.updateCompleteness);
            this.listenTo(this.model.educations, 'remove', this.updateCompleteness);
            
            this.listenTo(this.model.employments, 'change', this.updateCompleteness);
            this.listenTo(this.model.employments, 'remove', this.updateCompleteness);
        },

        onRender: function() {

            var self = this;

            this.ui.photo.colorbox();

            this.ui.inputFile.fileupload({
                type: 'PUT',
                dataType: 'json',
                done: function(e, data) {

                    self.model.set('photo', data.result.photo);
                },
                error: function() {
                    // say hello to user
                    noty({
                        type: 'error',
                        timeout: 5000,
                        text: "Sorry, the photo should be a file in *.jpg, *.gif or *.png format. and not bigger than 512kb. Please use a another one.",
                        layout: 'bottomRight'
                    });
                }
            });
        },

        // after show
        onShow: function() {
            this.$el.addClass('animated fadeInLeft');
        },

        updatePhoto: function() {

            var self = this;

            this.ui.photo.slRollOut('', function() {
                $(this).attr('src', self.model.get('photo'));
                $(this).removeClass('rollOut').addClass('rollIn');
            });
        },

        updateCompleteness: function() {

            var completeness = this.model.completeness(),
                progressClass = "progress-bar";

            if (completeness == 100) {
                progressClass += ' progress-bar-success';
            } else if (completeness > 85) {
                // progressClass = 'progress-bar';
            } else if (completeness > 70) {
                progressClass += ' progress-bar-warning';
            } else if (completeness > 50) {
                progressClass += ' progress-bar-pink';
            } else if (completeness > 30) {
                progressClass += ' progress-bar-purple';
            } else {
                progressClass += ' progress-bar-danger';
            }

            this.ui.progress.attr('data-percent', completeness + '%');
            this.ui.bar.removeClass().addClass(progressClass);
            this.ui.bar.css('width', completeness + '%');
        }
    });
});