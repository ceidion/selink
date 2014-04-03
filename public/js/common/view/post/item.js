define([
    'text!common/template/post/item.html',
    'text!common/template/post/detail.html',
    'text!common/template/post/detail-owner.html',
    'common/collection/base',
    'common/view/post/comment'
], function(
    defaultTemplate,
    detailTemplate,
    detailOwnerTemplate,
    BaseCollection,
    ItemView) {

    return Backbone.Marionette.CompositeView.extend({

        // class name
        className: 'isotope-item col-xs-12 col-sm-6 col-lg-4',

        // template
        getTemplate: function() {

            if (this.options.modal && this.model.get('isMine'))
                return detailOwnerTemplate;
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
            editArea: '.wysiwyg-editor',
            alertArea: '.alert',
            likeBtn: '.btn-like',
            bookmarkBtn: '.btn-bookmark',
            commentArea: '.dialogs',
            commentInput: 'textarea',
            commentBtn: '.btn-comment',
            menuToggler: '.widget-header .widget-toolbar'
        },

        // events
        events: {
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
            'mouseover': 'toggleMenuIndicator',
            'mouseout': 'toggleMenuIndicator'
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

            // if the post owner's id is user id
            if (this.model.get('_owner')._id === selink.userModel.id)
            // mark as my post
                this.model.set('isMine', true, {
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
                // do not re-isotope whole collection, that will cause image flicker
                reIsotope: false,
                patch: true,
                wait: true
            });
        },

        // show detail view
        showDetail: function() {

            var detailView = new this.constructor({
                model: this.model,
                modal: true
            });

            selink.modalArea.show(detailView);
            selink.modalArea.$el.modal('show');
        },

        // like this posts
        onLike: function() {

            var self = this;

            this.model.save({
                liked: selink.userModel.get('_id')
            }, {
                url: '/posts/' + this.model.get('_id') + '/like',
                success: function() {
                    // update the liked number
                    self.ui.likeBtn
                        .find('span')
                        .empty()
                        .text(self.model.get('liked').length);
                    // flip the icon and mark this post as liked
                    self.ui.likeBtn
                        .find('i')
                        .removeClass('icon-heart-empty')
                        .addClass('icon-heart')
                        .slFlip();
                    // remove like button, can't like it twice
                    self.ui.likeBtn.removeClass('btn-like');
                },
                // do not re-isotope whole collection, that will cause image flicker
                reIsotope: false,
                patch: true,
                wait: true
            });
        },

        // Bookmark this posts
        onBookmark: function() {

            var self = this;

            this.model.save({
                bookmarked: selink.userModel.get('_id')
            }, {
                url: '/posts/' + this.model.get('_id') + '/bookmark',
                success: function() {
                    // update the bookmark number
                    self.ui.bookmarkBtn
                        .find('span')
                        .empty()
                        .text(self.model.get('bookmarked').length);
                    // flip the icon and mark this post as bookmark
                    self.ui.bookmarkBtn
                        .find('i')
                        .removeClass('icon-star-empty')
                        .addClass('icon-star')
                        .slFlip();
                    // remove bookmark button, can't bookmark it twice
                    self.ui.bookmarkBtn.removeClass('btn-bookmark');
                },
                // do not re-isotope whole collection, that will cause image flicker
                reIsotope: false,
                patch: true,
                wait: true
            });
        },

        // open the comment area
        openComment: function() {

            var self = this;

            this.$el.find('.comment-area').css('margin-left', '40px');
            this.$el.find('.photo-area').slideDown();
            this.$el.find('.btn-area').slideDown('fast', function() {
                // enable autosize on comment area
                self.ui.commentInput.autosize({
                    // append: "\n",
                    callback: function() {
                        self.trigger("shiftColumn");
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

            this.collection.create({
                content: this.ui.commentInput.val()
            }, {
                success: function() {

                    if (self.collection.length == 1)
                        self.ui.commentArea.before("<hr>");
                    self.closeComment();
                },
                wait: true
            });
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
