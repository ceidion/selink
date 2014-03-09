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
                });
            }
        },

        onLike: function() {

            this.model.save({
                likedBy: selink.userModel.get('_id')
            }, {
                url: this.model.url() + '/like',
                success: function() {

                },
                patch: true
            })
        }
    });

});