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
            likeBtn: '.btn-like',
            replyBtn: '.fa-reply',
            editBtn: '.fa-pencil',
            deleteBtn: '.fa-trash-o',
            alertArea: '.alert',
        },

        // events
        events: {
            'click .fa-heart-o': 'onLike',
            'click .fa-reply': 'onReply',
            'click .fa-pencil': 'onEdit',
            'click .fa-trash-o': 'showAlert',
            'click .btn-remove-cancel': 'hideAlert',
            'click .btn-remove-comfirm': 'onRemove',
        },

        modelEvents: {
            // 'change:content': 'renderContent',
            'change:liked': 'renderLike'
        },

        // initializer
        initialize: function() {

            // if the owner of comment is user
            if (this.model.get('_owner')._id === selink.userModel.id)
                // mark it
                this.model.set('isMine', true, {slient: true});

            // if user's id exists in comment's liked list
            if (_.indexOf(this.model.get('liked'), selink.userModel.get('_id')) >= 0)
            // mark as liked
                this.model.set('isLiked', true, {
                    silent: true
                });
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

            this.ui.deleteBtn.tooltip({
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

        renderLike: function() {

            // update the liked number
            this.ui.likeBtn
                .find('span')
                .empty()
                .text(this.model.get('liked').length);
            // flip the icon and mark this post as liked
            this.ui.likeBtn
                .find('i')
                .removeClass('fa-heart-o')
                .addClass('fa-heart')
                .slFlip();
            // remove like button, can't like it twice
            this.ui.likeBtn.removeClass('btn-like');
        },

        onReply: function() {

        },

        onEdit: function() {

        },

        // show the comfirm alert
        showAlert: function(event) {

            event.preventDefault();

            var self = this;

            this.ui.alertArea
                .slideDown('fast', function() {
                    self.trigger("shiftColumn");
                })
                .find('i')
                .addClass('icon-animated-vertical');
        },

        // hide confirm alert
        hideAlert: function() {

            var self = this;

            this.ui.alertArea
                .slideUp('fast', function() {
                    self.trigger("shiftColumn");
                });
        },

        onRemove: function() {

            var self = this;
            console.log(this);
            this.model.destroy({
                success: function() {
                    self.trigger("shiftColumn");
                }
            });
        }
    });
});