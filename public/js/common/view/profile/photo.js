define([
    'common/view/item-base',
    'text!common/template/profile/photo.html'
], function(
    BaseView,
    template) {

    var PhotoItem = BaseView.extend({

        // template
        template: template,

        modelEvents: {
            'change:photo': 'updatePhoto'
        },

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                photo: 'img',
                inputFile: 'input[type="file"]',
            });
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
        }
    });

    return PhotoItem;
});