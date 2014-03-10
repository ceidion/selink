define([
    'text!common/template/post/item.html',
    'text!common/template/post/item-my-post.html'
], function(
    defaultTemplate,
    myPostTemplate) {

    return Backbone.Marionette.ItemView.extend({

        className: 'post-item',

        // template
        getTemplate: function(){

            if (this.model.get('isMyPost'))
                return myPostTemplate;
            else
                return defaultTemplate;
        },

        events: {
            'click .btn-like': 'onLike',
        },

        // initializer
        initialize: function() {

            if (!_.isObject(this.model.get('_owner'))) {
                this.model.set({
                    isMyPost: true,
                    _owner: {
                        firstName: selink.userModel.get('firstName'),
                        lastName: selink.userModel.get('lastName'),
                        photo: selink.userModel.get('photo')
                    }
                }, {silent:true});
            }

            if (_.indexOf(this.model.get('liked'), selink.userModel.get('_id')) >= 0) {
                this.model.set('isLiked', true, {silent:true});
            }
        },

        onLike: function() {

            var self = this;

            this.model.save({
                likedBy: selink.userModel.get('_id')
            }, {
                url: '/posts/' + this.model.get('_id') + '/like',
                success: function() {
                    self.$el.find('.btn-like')
                        .find('span')
                        .empty()
                        .text(self.model.get('liked').length);

                    self.$el.find('.btn-like')
                        .find('i')
                        .removeClass('icon-heart-empty')
                        .addClass('icon-heart')
                        .slFlip();

                    self.$el.find('.btn-like').removeClass('btn-like');
                },
                patch: true,
                wait: true,
                silent: true // supress the sync event
            });
        }
    });

});