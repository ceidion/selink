define([
    'text!common/template/post/item.html',
    // 'text!common/template/post/detail.html',
    'text!common/template/people/popover.html',
    'common/collection/base',
    'common/view/post/comment'
], function(
    template,
    // detailTemplate,
    popoverTemplate,
    BaseCollection,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // class name
        className: 'isotope-item col-xs-12 col-sm-6 col-lg-4',

        // template
        template: template,

        // item view container
        itemViewContainer: '.dialogs',

        // item view
        itemView: ItemView,

        // ui
        ui: {
            avatar: '.avatar',
            avatarLink: '.avatar-link',

            menuToggler: '.widget-header .widget-toolbar',
            removeBtn: '.btn-remove',
            forbidBtn: '.btn-forbid',

            alert: '.alert',
            cancelBtn: '.btn-remove-cancel',
            confirmBtn: '.btn-remove-confirm',

            postContent: '.content',
            likeBtn: '.btn-like',
            bookmarkBtn: '.btn-bookmark',
            showAllBtn: '.btn-show-all',

            comments: '.dialogs',
            commentInput: 'textarea',
            commentConfirmBtn: '.btn-comment',
            commentCancelBtn: '.btn-cancel',
            // editArea: '.wysiwyg-editor',
            // saveBtn: '.btn-save',
        },

        // events
        events: {
            'mouseover': 'toggleMenuIndicator',
            'mouseout': 'toggleMenuIndicator',
            'click @ui.avatarLink': 'toProfile',
            'click @ui.removeBtn': 'showAlert',
            'click @ui.forbidBtn': 'toggleForbid',
            'click @ui.cancelBtn': 'hideAlert',
            'click @ui.confirmBtn': 'onRemove',
            'click @ui.likeBtn': 'onLike',
            'click @ui.bookmarkBtn': 'onBookmark',
            'click @ui.showAllBtn': 'showAllComment',
            // 'click .btn-save': 'onSave',
            // 'click .btn-detail': 'showDetail',
            'focusin @ui.commentInput': 'openComment',
            'keyup @ui.commentInput': 'checkComment',
            'click @ui.commentConfirmBtn': 'onComment',
            'click @ui.commentCancelBtn': 'closeComment'
            // 'keyup .wysiwyg-editor': 'enableSave'
        },

        modelEvents: {
            'change:content': 'renderContent',
            'change:liked': 'renderLike',
            'change:bookmarked': 'renderBookmark',
        },

        collectionEvents: {
            'add': 'renderComments',
        },

        itemEvents: {
            'remove': 'onCommentRemove',
            'reply': 'onCommentReply',
            'shiftColumn': 'proxyShiftColumn'
        },

        // override appendHtml
        appendHtml: function(collectionView, itemView, index) {

            if (!this.options.modal && index < this.collection.length - 3)
                itemView.$el.addClass('hide');
            // prepend comment to container, later comments comeout first
            this.ui.comments.prepend(itemView.el);
        },

        // initializer
        initialize: function() {

            // if (this.options.modal)
            //     this.$el.removeClass(this.className).addClass('modal-dialog post-modal');

            // create comments collction
            this.collection = this.model.comments;
        },

        // after render
        onRender: function() {

            var self = this;

            this.ui.avatar.popover({
                html: true,
                trigger: 'hover',
                container: 'body',
                placement: 'auto right',
                title: '<img src="' + this.model.get('_owner').cover + '" />',
                content: _.template(popoverTemplate, this.model.get('_owner')),
            });

            // add tooltip on add button
            this.ui.likeBtn.tooltip({
                placement: 'top',
                title: "いいね！"
            });

            this.ui.bookmarkBtn.tooltip({
                placement: 'top',
                title: "お気に入り"
            });

            // // initiate wysiwyg eidtor for memo
            // this.ui.editArea.ace_wysiwyg().prev().addClass('wysiwyg-style3');
        },

        // show operation menu toggler
        toggleMenuIndicator: function() {
            this.ui.menuToggler.toggleClass('hidden');
        },

        // turn to user profile page
        toProfile: function(e) {

            // stop defautl link behavior
            e.preventDefault();

            // destroy the popover on user's photo
            this.ui.avatar.popover('destroy');
            // turn the page manually
            window.location = '#profile/' + this.model.get('_owner')._id;
        },

        // show remove confirm alert
        showAlert: function(event) {

            var self = this;

            // stop defautl link behavior
            event.preventDefault();
            // show remove confirm alert
            this.ui.alert
                .slideDown('fast', function() {
                    self.trigger("shiftColumn");
                })
                .find('i')
                .addClass('icon-animated-vertical');
        },

        // hide remove confirm alert
        hideAlert: function() {

            var self = this;

            this.ui.alert
                .slideUp('fast', function() {
                    self.trigger("shiftColumn");
                });
        },

        // remove post
        onRemove: function() {

            // parent view handle remove
            this.trigger('remove');

            // // if this is a detail view
            // if (this.options.modal)
            //     // hide the modal dialog
            //     selink.modalArea.$el.modal('hide');
        },

        // forbid/allow comment
        toggleForbid: function(event) {

            var self = this;

            // stop defautl link behavior
            event.preventDefault();
            // toggle model commentable setting
            this.model.save({
                'setting.commentable': !this.model.get('setting.commentable')
            }, {
                success: function() {
                    // hide comment area
                    self.$el.find('.widget-toolbox').toggleClass('hidden');
                    // toggle forbid button status
                    self.$el.find('.btn-forbid').closest('li').toggleClass('hidden');
                    self.trigger("shiftColumn");
                },
                reIsotope: false, // do not re-isotope whole collection, that will cause image flicker
                patch: true,
                wait: true
            });
        },

        // // show detail view
        // showDetail: function() {

        //     // detail use the same view just like this
        //     // but pass an custom option "modal: true", view will switch template by this
        //     var detailView = new this.constructor({
        //         model: this.model,
        //         modal: true
        //     });

        //     // detail also has a "remove" button, emit remove event
        //     // for achive the same behavior of composite-isotope view, have delegate it to this view
        //     this.listenTo(detailView, 'remove', this.onRemove);

        //     selink.modalArea.show(detailView);
        //     selink.modalArea.$el.modal('show');
        // },

        // // change the status of save button
        // enableSave: function() {

        //     // get user input
        //     var input = this.ui.editArea.cleanHtml();

        //     // if user input is not empty
        //     if (input && !_.str.isBlank(input)) {
        //         // enable the post button
        //         this.ui.saveBtn.removeClass('disabled');
        //     } else {
        //         // disable ths post button
        //         this.ui.saveBtn.addClass('disabled');
        //     }
        // },

        // onSave: function() {

        //     this.model.save({
        //         content: this.ui.editArea.cleanHtml()
        //     }, {
        //         success: function(model, response, options) {
        //             selink.modalArea.$el.modal('hide');
        //         },
        //         reIsotope: false, // do not re-isotope whole collection, that will cause image flicker
        //         patch: true,
        //         wait: true
        //     });
        // },

        // rerender post content
        renderContent: function() {
            this.ui.postContent.empty().html(this.model.get('content'));
            this.trigger("shiftColumn");
        },

        // like this posts
        onLike: function() {

            this.model.save({
                liked: selink.userModel.id // TODO: no need to pass this parameter
            }, {
                url: '/posts/' + this.model.get('_id') + '/like',
                reIsotope: false, // do not re-isotope whole collection, that will cause image flicker
                patch: true,
                wait: true
            });
        },

        // rerender like mark
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

        // Bookmark this posts
        onBookmark: function() {

            this.model.save({
                bookmarked: selink.userModel.id // TODO: no need to pass this parameter
            }, {
                url: '/posts/' + this.model.get('_id') + '/bookmark',
                reIsotope: false, // do not re-isotope whole collection, that will cause image flicker
                patch: true,
                wait: true
            });
        },

        // rerender bookmark mark
        renderBookmark: function() {

            // update the bookmark number
            this.ui.bookmarkBtn
                .find('span')
                .empty()
                .text(this.model.get('bookmarked').length);
            // flip the icon and mark this post as bookmark
            this.ui.bookmarkBtn
                .find('i')
                .removeClass('fa-star-o')
                .addClass('fa-star')
                .slFlip();
            // remove bookmark button, can't bookmark it twice
            this.ui.bookmarkBtn.removeClass('btn-bookmark');
        },

        // display all comments
        showAllComment: function() {

            console.log("message");

            var self = this;

            this.ui.comments.find('.hide').removeClass('hide').slideDown(function() {
                self.ui.showAllBtn.hide();
                self.trigger("shiftColumn");
            });
        },

        // open the comment area
        openComment: function() {

            var self = this;

            this.$el.find('.comment-area').css('margin-left', '58px');
            this.$el.find('.photo-area').slideDown();
            this.$el.find('.btn-area').slideDown('fast', function() {
                // enable autosize on comment area
                self.ui.commentInput.autosize({
                    callback: function() {
                        setTimeout(function() {
                            self.trigger("shiftColumn");
                        }, 200);
                    }
                });
            });
        },

        // close the comment area
        closeComment: function() {

            var self = this;

            this.$el.find('.comment-area').css('margin-left', '0px');
            this.$el.find('.photo-area').hide();
            this.$el.find('.btn-area').slideUp('fast', function() {
                self.ui.commentInput.val('').trigger('autosize.destroy');
                self.trigger("shiftColumn");
            });
        },

        // check comment input
        checkComment: function() {

            // if the comment input is not blank
            if (!_.str.isBlank(this.ui.commentInput.val()))
            // enable comment button
                this.ui.commentConfirmBtn.removeClass('disabled');
            else
            // disable comment button
                this.ui.commentConfirmBtn.addClass('disabled');
        },

        // comment this post
        onComment: function() {

            var self = this;

            // replace newline in text to html newline
            var comment = this.ui.commentInput.val().replace(/(?:\r\n|\r|\n)/g, '<br />');

            // create new comment
            this.collection.create({
                content: comment
            }, {
                success: function() {

                    // if this is the first comment
                    if (self.collection.length == 1)
                        // add a separator
                        self.ui.comments.before("<hr>");
                    // close the comment area
                    self.closeComment();
                },
                wait: true
            });
        },

        // rerender comments
        renderComments: function() {
            this.trigger("shiftColumn");
        },

        // remove comment
        onCommentRemove: function(event, view) {

            var self = this;

            view.model.destroy({
                success: function(model, response) {
                    self.trigger("shiftColumn");
                },
                wait: true
            });
        },

        // reply comment
        onCommentReply: function(event, view) {

            var person = view.model.get('_owner'),
                atPerson = "@" + person.firstName + ' ' + person.lastName + ' ';

            this.ui.commentInput.val(atPerson);
            this.openComment();
        },

        // child view size changed
        proxyShiftColumn: function() {
            // fire shift column event to re-layout
            this.trigger("shiftColumn");
        }

    });
});
