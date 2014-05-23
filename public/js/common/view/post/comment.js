define([
    'text!common/template/post/comment.html',
    'text!common/template/people/popover.html'
],function(
    template,
    popoverTemplate
) {

    return Backbone.Marionette.ItemView.extend({

        // template
        template: template,

        // class name
        className: 'itemdiv dialogdiv',

        // ui
        ui: {
            likeBtn: '.btn-comment-like',
            replyBtn: '.btn-reply',
            editBtn: '.btn-edit',
            removeBtn: '.btn-comment-remove',
            alert: '.alert',
            likeNum: '.like-num',
            action: '.action',
            editInput: 'textarea[name="edit"]'
        },

        // events
        events: {
            'click @ui.likeBtn': 'onLike',
            'click @ui.replyBtn': 'onReply',
            'click @ui.editBtn': 'showEditor',
            'click @ui.removeBtn': 'showAlert',
            'click .btn-remove-cancel': 'hideAlert',
            'click .btn-remove-comfirm': 'onRemove',
            'click .btn-edit-cancel': 'hideEditor',
            'click .btn-edit-comfirm': 'onEdit',
        },

        modelEvents: {
            'change:content': 'renderContent',
            'change:liked': 'renderLike'
        },

        // after render
        onRender: function() {

            // add popover on user photo
            this.$el.find('img').popover({
                html: true,
                trigger: 'hover',
                container: 'body',
                placement: 'auto top',
                title: '<img src="' + this.model.get('_owner').cover + '" />',
                content: _.template(popoverTemplate, this.model.get('_owner')),
            });

            // add tooltip on add button
            this.ui.likeBtn.tooltip({
                container: 'body',
                placement: 'top',
                title: "いいね！",
                template: '<div class="tooltip tooltip-error"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
            });

            this.ui.replyBtn.tooltip({
                container: 'body',
                placement: 'top',
                title: "返信",
                template: '<div class="tooltip tooltip-info"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
            });

            this.ui.editBtn.tooltip({
                container: 'body',
                placement: 'top',
                title: "編集",
                template: '<div class="tooltip tooltip-success"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
            });

            this.ui.removeBtn.tooltip({
                container: 'body',
                placement: 'top',
                title: "削除",
                template: '<div class="tooltip tooltip-error"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
            });
        },

        // like comment
        onLike: function() {

            this.model.save({
                liked: selink.userModel.get('_id') // TODO: no need to pass this parameter
            }, {
                url: this.model.url() + '/like',
                reIsotope: false, // do not re-isotope whole collection, that will cause image flicker
                patch: true,
                wait: true
            });
        },

        // rerender like icon and number
        renderLike: function() {

            // update the liked number
            this.ui.likeNum
                .empty()
                .text(this.model.get('liked').length);
            // flip the icon and mark this post as liked
            this.ui.likeBtn
                .removeClass('fa-heart-o')
                .addClass('fa-heart')
                .slFlip();
            // remove like button, can't like it twice
            this.ui.likeBtn.removeClass('btn-comment-like blink');
        },

        // reply comment
        onReply: function() {
            this.trigger('reply');
        },

        // display comment editor
        showEditor: function() {

            var self = this;

            // hide action buttons
            this.ui.action.slideUp('fast');

            // hide plain comment content
            this.$el.find('.text').slideUp('fast', function() {

                // display editor
                self.$el.find('.editor').slideDown('fast', function() {

                    // enable autosize on edit area
                    self.ui.editInput.autosize({
                        callback: function() {
                            setTimeout(function() {
                                self.trigger("shiftColumn");
                            }, 200);
                        }
                    });
                });
            });
        },

        // hide comment editor
        hideEditor: function() {

            var self = this;

            // hide editor
            this.$el.find('.editor').slideUp('fast', function() {

                // display plain comment content
                self.$el.find('.text').slideDown('fast');

                // display action buttons
                self.ui.action.slideDown('fast', function() {

                    // destroy autosize
                    self.ui.editInput.trigger('autosize.destroy');
                    self.trigger('shiftColumn');
                });
            });
        },

        // edit comment
        onEdit: function() {

            var self = this;
            // get user input
            var content = this.ui.editInput.val().replace(/(?:\r\n|\r|\n)/g, '<br />');

            // update comment
            this.model.save({
                content: content
            }, {
                success: function() {
                    self.hideEditor();
                },
                reIsotope: false, // do not re-isotope whole collection, that will cause image flicker
                patch: true,
                wait: true
            });
        },

        // rerender comment content
        renderContent: function() {
            this.$el.find('.text').empty().html(this.model.get('content'));
        },

        // show the comfirm alert
        showAlert: function(event) {

            var self = this;

            this.ui.action.slideUp('fast', function() {
                self.ui.alert.slideDown('fast', function() {
                    self.trigger("shiftColumn");
                })
                .find('i')
                .addClass('icon-animated-vertical');
            });
        },

        // hide confirm alert
        hideAlert: function() {

            var self = this;

            this.ui.alert.slideUp('fast', function() {
                self.ui.action.slideDown('fast');
                self.trigger("shiftColumn");
            });
        },

        // remove comment
        onRemove: function() {
            this.trigger('remove');
        }
    });
});