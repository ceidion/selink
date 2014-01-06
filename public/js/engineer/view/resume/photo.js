define([
    'view/common/item-base',
    'text!template/resume/photo.html'
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

                    $.gritter.add({
                        text: '<i class="icon-camera icon-2x animated pulse"></i>&nbsp;&nbsp;写真は更新しました',
                        class_name: 'gritter-success'
                    });
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

        updatePhoto: function() {

            var self = this;
            
            this.ui.photo.addClass('animated rollOut');
            this.ui.photo.one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd animationend', function() {
                $(this).attr('src', self.model.get('photo'));
                $(this).removeClass('rollOut').addClass('rollIn');
            });
        }
    });

    return PhotoItem;
});