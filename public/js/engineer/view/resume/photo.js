define([
    'vent/vent',
    'view/common/item-base',
    'text!template/resume/photo.html'
], function(
    vent,
    BaseView,
    template) {

    var PhotoItem = BaseView.extend({

        // template
        template: template,

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

                    self.ui.photo.addClass('animated rollOut');
                    self.ui.photo.one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd', function() {
                        $(this).attr('src', data.result.photo);
                        $(this).removeClass('rollOut').addClass('rollIn');
                    });

                    $.gritter.add({
                        text: '<i class="icon-camera icon-2x animated pulse"></i>&nbsp;&nbsp;写真は更新しました',
                        class_name: 'gritter-success'
                    });

                    vent.trigger('profile:photo', {src: data.result.photo});
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
        }
    });

    return PhotoItem;
});