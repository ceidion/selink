define([
    'text!common/template/post/item.html',
    'text!common/template/post/item-my-post.html'
], function(
    defaultTemplate,
    myPostTemplate) {

    return Backbone.Marionette.ItemView.extend({

        className: 'post-item col-xs-12 col-sm-6 col-lg-4',

        // template
        getTemplate: function(){

            if (this.model.get('isMyPost'))
                return myPostTemplate;
            else
                return defaultTemplate;
        },

        // events
        events: {
            'click .btn-like': 'onLike',
            'click .btn-comment': 'onComment',
            'focusin textarea': 'openComment',
            'focusout textarea': 'closeComment'
        },

        // initializer
        initialize: function() {

            // if this post's owner is not an object
            if (!_.isObject(this.model.get('_owner'))) {
                // then it's user's posts, fill the owner with user info
                this.model.set({
                    isMyPost: true,
                    _owner: {
                        firstName: selink.userModel.get('firstName'),
                        lastName: selink.userModel.get('lastName'),
                        photo: selink.userModel.get('photo')
                    }
                }, {silent:true});
            }

            // if user's id exists in post's liked list
            if (_.indexOf(this.model.get('liked'), selink.userModel.get('_id')) >= 0) {
                // mark as liked
                this.model.set('isLiked', true, {silent:true});
            }
        },

        // after render
        onRender: function() {
            // enable autosize on comment area
            this.$el.find('textarea').autosize({append: "\n"});
        },

        // like this posts
        onLike: function() {

            var self = this;

            this.model.save({
                liked: selink.userModel.get('_id')
            }, {
                url: '/posts/' + this.model.get('_id'),
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

            var heightBefore = this.$el.height();

            this.$el.find('.comment-area').css('margin-left', '40px');
            this.$el.find('.photo-area').show().slFadeInLeft();
            this.$el.find('.btn-area').slideDown();

            var heightAfter = this.$el.height();

            console.log("before: " + heightBefore + " -> after: " + heightAfter);

            this.$el.css({ height: "+=46" });

            this.trigger("comment:opened");
        },

        // close the comment area
        closeComment: function() {

            var heightBefore = this.$el.height();

            this.$el.find('.comment-area').css('margin-left', '0px');
            this.$el.find('.photo-area').hide();
            this.$el.find('.btn-area').slideUp();

            var heightAfter = this.$el.height();

            console.log("before: " + heightBefore + " -> after: " + heightAfter);

            this.$el.css({ height: "-=46" });

            this.trigger("comment:closed");
        },

        // comment this post
        onComment: function() {

            var self = this;

            this.model.save({
                _owner: selink.userModel.get('_id'),
                content: this.$el.find('textarea').val()
            }, {
                url: '/posts/' + this.model.get('_id'),
                success: function() {

                },
                patch: true,
                wait: true,
                silent: true // supress the sync event
            });
        }
    });

});