define([
    'text!common/template/post/item.html',
    'text!common/template/post/item-owner.html',
    'common/view/post/comment'
], function(
    defaultTemplate,
    myPostTemplate,
    ItemView) {

    var CommentsCollection = Backbone.Collection.extend({

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url: function() {
            return '/posts/' + this.document.id + '/comments';
        },

        comparator: function(comment) {
            // sort by createDate
            var date = moment(comment.get('createDate'));
            return Number(date.valueOf());
        }
    });

    return Backbone.Marionette.CompositeView.extend({

        className: 'post-item col-xs-12 col-sm-6 col-lg-4',

        // template
        getTemplate: function(){

            if (this.model.get('_owner')._id === selink.userModel.id)
                return myPostTemplate;
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
            'click .btn-forbid': 'onForbid',
            'click .btn-like': 'onLike',
            'click .btn-comment': 'onComment',
            'click .btn-cancel': 'closeComment',
            'focusin textarea': 'openComment',
            'click .btn-show': 'showAllComment',
            'mouseover': 'showToolBar',
            'mouseout': 'hideToolBar'
        },

        // override appendHtml
        appendHtml: function(collectionView, itemView, index) {

            if (index < this.collection.length - 3)
                itemView.$el.addClass('hide');
            // prepend comment to container, later comments comeout first
            this.$el.find('.dialogs').prepend(itemView.el);
            this.trigger("comment:change");
        },

        // initializer
        initialize: function() {

            // if user's id exists in post's liked list
            if (_.indexOf(this.model.get('liked'), selink.userModel.get('_id')) >= 0) {
                // mark as liked
                this.model.set('isLiked', true, {silent:true});
            }

            this.collection = new CommentsCollection(this.model.get('comments'));
            this.collection.document = this.model;
        },

        // after render
        onRender: function() {

            var self = this;

            // add tooltip on add button
            this.$el.find('.btn-like').tooltip({
                placement: 'top',
                title: "いいね！"
            });

            this.$el.find('.btn-favorite').tooltip({
                placement: 'top',
                title: "お気に入り"
            });

            // enable autosize on comment area
            this.$el.find('textarea').autosize({
                append: "\n",
                callback: function() {
                    self.trigger("comment:change");
                }
            });
        },

        showAlert: function(event) {

            event.preventDefault();

            var self = this;

            this.$el.find('.alert')
                .slideDown('fast', function() {
                    self.trigger("comment:change");
                })
                .find('i')
                .addClass('icon-animated-vertical');
        },

        hideAlert: function() {

            var self = this;

            this.$el.find('.alert').slideUp('fast', function() {
                self.trigger("comment:change");
            });
        },

        onRemove: function() {

            var self = this;

            // TODO: maybe I should do this on parent view
            $('.post-container').isotope('remove', this.$el, function() {

                self.model.destroy({
                    success: function(model, response) {
                    },
                    wait: true
                });
            });
        },

        onForbid: function(event) {

            event.preventDefault();

            var self = this;

            this.model.save({
                'setting.commentable': false
            }, {
                success: function() {

                },
                patch: true,
                wait: true,
            });
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
                patch: true,
                wait: true,
                silent: true // supress the sync event
            });
        },

        // open the comment area
        openComment: function() {

            var self = this;

            this.$el.find('.comment-area').css('margin-left', '40px');
            this.$el.find('.photo-area').slideDown();
            this.$el.find('.btn-area').slideDown('fast', function() {
                self.trigger("comment:change");
            });
        },

        // close the comment area
        closeComment: function() {

            var self = this;

            this.$el.find('.comment-area').css('margin-left', '0px');
            this.$el.find('.photo-area').hide();
            this.$el.find('.btn-area').slideUp('fast', function() {
                self.trigger("comment:change");
            });
        },

        // comment this post
        onComment: function() {

            var self = this;

            this.collection.create({
                _owner: selink.userModel.get('_id'),
                content: this.$el.find('textarea').val()
            }, {
                success: function() {
                    self.closeComment();
                },
                wait: true
            });
        },

        showAllComment: function() {

            var self = this;

            this.$el.find('.dialogs .hide').removeClass('hide').slideDown(function() {
                self.$el.find('.btn-show').hide();
                self.trigger("comment:change");
            });
        },

        showToolBar: function() {
            this.$el.find('.widget-header .widget-toolbar').removeClass('hide');
        },

        hideToolBar: function() {
            this.$el.find('.widget-header .widget-toolbar').addClass('hide');
        }
    });

});