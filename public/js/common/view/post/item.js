define([
    'common/view/item-base',
    'text!common/template/post/item.html',
    'text!common/template/post/item-my-post.html'
], function(
    BaseView,
    defaultTemplate,
    myPostTemplate) {

    return BaseView.extend({

        className: 'post-item',

        // template
        getTemplate: function(){

            if (this.model.get('isMyPost'))
                return myPostTemplate;
            else
                return defaultTemplate;
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

        onRender: function() {
        }
    });

});