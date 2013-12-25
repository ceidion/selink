define([
    'view/common/item-base',
    'text!template/resume/photo.html'
], function(
    BaseView,
    template) {

    var PhotoItem = BaseView.extend({

        // template
        template: template,

        // initializer
        initialize: function() {

            this.ui = _.extend(this.ui, {
                photo: 'img',
                inputFile: 'input[type="file"]',
            });

            // this.events = _.extend(this.events, {
            //     'click .btn': 'save'
            // });
        },

        onRender: function() {

            var self = this;

            this.ui.inputFile.fileupload({
                type: 'PUT',
                dataType: 'json',
                done: function(e, data) {

                    self.ui.photo.addClass('animated rollOut');
                    self.ui.photo.one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd', function() {
                        $(this).attr('src', data.result.photo);
                        $(this).removeClass('rollOut').addClass('rollIn');
                    });

                    // self.ui.photo.fadeOut(function() {
                    //     self.ui.photo.attr('src', data.result.photo);
                    //     self.ui.photo.fadeIn();
                    // });
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

        getData: function(event) {

            $target = $(event.target);

            // TODO: this is not right
            if ($target.prop('tagName') == "I")
                return {
                    gender: $target.closest('.btn').find('input').val()
                };
            else
                return {
                    gender: $target.find('input').val()
                };
        },

        renderValue: function(data) {
            this.ui.value.text(data.gender);
        },

        successMsg: function(data) {
            return "性別は「" +　data.gender + "」に更新しました。";
        }
    });

    return PhotoItem;
});