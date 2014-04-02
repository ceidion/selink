define([
    'text!common/template/post/item.html',
    'text!common/template/post/detail.html',
    'text!common/template/post/item-owner.html',
    'common/collection/base',
    'common/view/post/comment'
], function(
    defaultTemplate,
    detailTemplate,
    ownerTemplate,
    BaseCollection,
    ItemView) {

    return Backbone.Marionette.CompositeView.extend({

        // class name
        className: 'isotope-item col-xs-12 col-sm-6 col-lg-4',

        // template
        getTemplate: function(){

            if (this.options.modal)
                return detailTemplate;
            else if (this.model.get('_owner')._id === selink.userModel.id)
                return ownerTemplate;
            else
                return defaultTemplate;
        },

        // item view container
        itemViewContainer: '.dialogs',

        // item view
        itemView: ItemView,

        // events
        events: {
            'click .btn-remove': 'showAlert',
            'click .btn-remove-cancel': 'hideAlert',
            'click .btn-remove-comfirm': 'onRemove',
            'click .btn-forbid': 'onToggleForbid',
            'click .btn-detail': 'showDetail',
            'click .btn-like': 'onLike',
            'click .btn-bookmark': 'onBookmark',
            'click .btn-comment': 'onComment',
            'click .btn-cancel': 'closeComment',
            'focusin textarea': 'openComment',
            'click .btn-show': 'showAllComment',
            'mouseover': 'toggleMenuIndicator',
            'mouseout': 'toggleMenuIndicator'
        },

        // override appendHtml
        appendHtml: function(collectionView, itemView, index) {

            if (!this.options.modal && index < this.collection.length - 3)
                itemView.$el.addClass('hide');
            // prepend comment to container, later comments comeout first
            this.$el.find('.dialogs').prepend(itemView.el);
        },

        // initializer
        initialize: function() {

            if (this.options.modal)
                this.$el.removeClass(this.className).addClass('modal-dialog post-modal');

            // if user's id exists in post's liked list
            if (_.indexOf(this.model.get('liked'), selink.userModel.get('_id')) >= 0) {
                // mark as liked
                this.model.set('isLiked', true, {silent:true});
            }

            // if user's id exists in post's bookmark list
            if (_.indexOf(this.model.get('bookmarked'), selink.userModel.get('_id')) >= 0) {
                // mark as marked
                this.model.set('isMarked', true, {silent:true});
            }

            // create comments collction
            this.collection = this.model.comments;

            // set comment num
            this.model.set('commentNum', this.model.comments.length, {silent: true});
        },

        // after render
        onRender: function() {

            var self = this;

            // add tooltip on add button
            this.$el.find('.btn-like').tooltip({
                placement: 'top',
                title: "いいね！"
            });

            this.$el.find('.btn-bookmark').tooltip({
                placement: 'top',
                title: "お気に入り"
            });

        },

        // show the comfirm alert
        showAlert: function(event) {

            event.preventDefault();

            var self = this;

            this.$el.find('.alert')
                .slideDown('fast', function() {
                    self.trigger("shiftColumn");
                })
                .find('i')
                .addClass('icon-animated-vertical');
        },

        // hide confirm alert
        hideAlert: function() {

            var self = this;

            this.$el.find('.alert').slideUp('fast', function() {
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
                    self.$el.find('.btn-like')
                        .find('span')
                        .empty()
                        .text(self.model.get('liked').length);
                    // flip the icon and mark this post as liked
                    self.$el.find('.btn-like')
                        .find('i')
                        .removeClass('icon-heart-empty')
                        .addClass('icon-heart')
                        .slFlip();
                    // remove like button, can't like it twice
                    self.$el.find('.btn-like').removeClass('btn-like');
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
                    self.$el.find('.btn-bookmark')
                        .find('span')
                        .empty()
                        .text(self.model.get('bookmarked').length);
                    // flip the icon and mark this post as bookmark
                    self.$el.find('.btn-bookmark')
                        .find('i')
                        .removeClass('icon-star-empty')
                        .addClass('icon-star')
                        .slFlip();
                    // remove like button, can't like it twice
                    self.$el.find('.btn-bookmark').removeClass('btn-bookmark');
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
                self.$el.find('textarea').autosize({
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
                self.$el.find('textarea').val('').trigger('autosize.destroy');
                self.trigger("shiftColumn");
            });
        },

        // comment this post
        onComment: function() {

            var self = this;

            this.collection.create({
                content: this.$el.find('textarea').val()
            }, {
                success: function() {

                    if (self.collection.length == 1)
                        self.$el.find('.dialogs').before("<hr>");
                    self.closeComment();
                },
                wait: true
            });
        },

        // display all comments
        showAllComment: function() {

            var self = this;

            this.$el.find('.dialogs .hide').removeClass('hide').slideDown(function() {
                self.$el.find('.btn-show').hide();
                self.trigger("shiftColumn");
            });
        },

        // show operation menu indicator
        toggleMenuIndicator: function() {
            this.$el.find('.widget-header .widget-toolbar').toggleClass('hidden');
        }
    });

});