define([
    'text!common/template/post/item.html',
    'text!common/template/post/detail.html',
    'text!common/template/people/popover.html',
    'common/collection/base',
    'common/view/post/comment'
], function(
    defaultTemplate,
    detailTemplate,
    popoverTemplate,
    BaseCollection,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // class name
        className: 'isotope-item col-xs-12 col-sm-6 col-lg-4',

        // template
        getTemplate: function() {

            // if (this.options.modal && this.model.get('isMine'))
            //     return detailOwnerTemplate;
            if (this.options.modal)
                return detailTemplate;
            else
                return defaultTemplate;
        },

        // item view container
        itemViewContainer: '.dialogs',

        // item view
        itemView: ItemView,

        // ui
        ui: {
            avatar: '.avatar',
            contentArea: '.content',
            editArea: '.wysiwyg-editor',
            alertArea: '.alert',
            saveBtn: '.btn-save',
            likeBtn: '.btn-like',
            bookmarkBtn: '.btn-bookmark',
            commentArea: '.dialogs',
            commentInput: 'textarea',
            commentBtn: '.btn-comment',
            menuToggler: '.widget-header .widget-toolbar'
        },

        // events
        events: {
            'click .profile-link': 'onProfile',
            'click .btn-save': 'onSave',
            'click .btn-remove': 'showAlert',
            'click .btn-remove-cancel': 'hideAlert',
            'click .btn-remove-comfirm': 'onRemove',
            'click .btn-forbid': 'onToggleForbid',
            'click .btn-detail': 'showDetail',
            'click .btn-like': 'onLike',
            'click .btn-bookmark': 'onBookmark',
            'focusin textarea': 'openComment',
            'keyup textarea': 'checkComment',
            'click .btn-comment': 'onComment',
            'click .btn-cancel': 'closeComment',
            'click .btn-show': 'showAllComment',
            'keyup .wysiwyg-editor': 'enableSave',
            'mouseover': 'toggleMenuIndicator',
            'mouseout': 'toggleMenuIndicator'
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

        },

        // override appendHtml
        appendHtml: function(collectionView, itemView, index) {

            if (!this.options.modal && index < this.collection.length - 3)
                itemView.$el.addClass('hide');
            // prepend comment to container, later comments comeout first
            this.ui.commentArea.prepend(itemView.el);
        },

        // initializer
        initialize: function() {

            if (this.options.modal)
                this.$el.removeClass(this.className).addClass('modal-dialog post-modal');

            // if (!this.options.modal && this.model.get('liked').length >= 1) {
            //     this.$el.removeClass('col-sm-6 col-lg-4').addClass('col-sm-12 col-lg-8');
            //     this.$el.find('.widget-header').addClass('header-color-orange');
            // }

            // if the post owner's id is user id
            if (this.model.get('_owner')._id === selink.userModel.id)
            // mark as my post
                this.model.set('isMine', true, {
                    silent: true
                });

            // if the viewer is administrator
            if (selink.userModel.get('type') === "admin")
            // mark his user type
                this.model.set('isAdmin', true, {
                    silent: true
                });

            // if user's id exists in post's liked list
            if (_.indexOf(this.model.get('liked'), selink.userModel.get('_id')) >= 0)
            // mark as liked
                this.model.set('isLiked', true, {
                    silent: true
                });

            // if user's id exists in post's bookmark list
            if (_.indexOf(this.model.get('bookmarked'), selink.userModel.get('_id')) >= 0)
            // mark as marked
                this.model.set('isMarked', true, {
                    silent: true
                });

            // create comments collction
            this.collection = this.model.comments;

            // set comment num
            this.model.set('commentNum', this.model.comments.length, {
                silent: true
            });
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

            // initiate wysiwyg eidtor for memo
            this.ui.editArea.ace_wysiwyg().prev().addClass('wysiwyg-style3');
        },

        onProfile: function(e) {

            e.preventDefault();

            this.ui.avatar.popover('destroy');
            window.location = '#profile/' + this.model.get('_owner')._id;
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

        // remove post
        onRemove: function() {

            this.trigger('remove');

            // if this is a detail view
            if (this.options.modal)
                // hide the modal dialog
                selink.modalArea.$el.modal('hide');
        },

        // forbid/allow comment
        onToggleForbid: function(event) {

            event.preventDefault();

            var self = this;

            this.model.save({
                'setting.commentable': !this.model.get('setting.commentable')
            }, {
                success: function() {
                    self.$el.find('.widget-toolbox').toggleClass('hidden');
                    self.$el.find('.btn-forbid').closest('li').toggleClass('hidden');
                    self.trigger("shiftColumn");
                },
                reIsotope: false, // do not re-isotope whole collection, that will cause image flicker
                patch: true,
                wait: true
            });
        },

        // show detail view
        showDetail: function() {

            // detail use the same view just like this
            // but pass an custom option "modal: true", view will switch template by this
            var detailView = new this.constructor({
                model: this.model,
                modal: true
            });

            // detail also has a "remove" button, emit remove event
            // for achive the same behavior of composite-isotope view, have delegate it to this view
            this.listenTo(detailView, 'remove', this.onRemove);

            selink.modalArea.show(detailView);
            selink.modalArea.$el.modal('show');
        },

        // change the status of save button
        enableSave: function() {

            // get user input
            var input = this.ui.editArea.cleanHtml();

            // if user input is not empty
            if (input && !_.str.isBlank(input)) {
                // enable the post button
                this.ui.saveBtn.removeClass('disabled');
            } else {
                // disable ths post button
                this.ui.saveBtn.addClass('disabled');
            }
        },

        onSave: function() {

            this.model.save({
                content: this.ui.editArea.cleanHtml()
            }, {
                success: function(model, response, options) {
                    selink.modalArea.$el.modal('hide');
                },
                reIsotope: false, // do not re-isotope whole collection, that will cause image flicker
                patch: true,
                wait: true
            });
        },

        renderContent: function() {
            this.ui.contentArea.empty().html(this.model.get('content'));
            this.trigger("shiftColumn");
        },

        // like this posts
        onLike: function() {

            this.model.save({
                liked: selink.userModel.get('_id') // TODO: no need to pass this parameter
            }, {
                url: '/posts/' + this.model.get('_id') + '/like',
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

        // Bookmark this posts
        onBookmark: function() {

            this.model.save({
                bookmarked: selink.userModel.get('_id') // TODO: no need to pass this parameter
            }, {
                url: '/posts/' + this.model.get('_id') + '/bookmark',
                reIsotope: false, // do not re-isotope whole collection, that will cause image flicker
                patch: true,
                wait: true
            });
        },

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
                this.ui.commentBtn.removeClass('disabled');
            else
            // disable comment button
                this.ui.commentBtn.addClass('disabled');
        },

        // comment this post
        onComment: function() {

            var self = this;

            var comment = this.ui.commentInput.val().replace(/(?:\r\n|\r|\n)/g, '<br />');

            this.collection.create({
                content: comment
            }, {
                success: function() {

                    if (self.collection.length == 1)
                        self.ui.commentArea.before("<hr>");
                    self.closeComment();
                },
                wait: true
            });
        },

        renderComments: function() {
            this.trigger("shiftColumn");
        },

        // display all comments
        showAllComment: function() {

            var self = this;

            this.ui.commentArea.find('.hide').removeClass('hide').slideDown(function() {
                self.$el.find('.btn-show').hide();
                self.trigger("shiftColumn");
            });
        },

        // show operation menu indicator
        toggleMenuIndicator: function() {
            this.ui.menuToggler.toggleClass('hidden');
        }

    });
});
