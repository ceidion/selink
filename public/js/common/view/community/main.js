define([
    'text!common/template/community/main.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/model/post',
    'common/view/post/item'
], function(
    pageTemplate,
    BaseView,
    BaseCollection,
    PostModel,
    ItemView
) {

    var PostsCollection = BaseCollection.extend({

        model: PostModel,

        url: '/posts?category=community'
    });

    return BaseView.extend({

        // Template
        template: pageTemplate,

        // child view
        childView: ItemView,

        // ui
        ui: {
            groupName: 'input',
            createBtn: 'button'
        },

        // events
        events: {
            'keyup input': 'enableCreateBtn',
            'click button': 'createGroup'
        },

        // Initializer
        initialize: function() {

            // create posts collection
            this.collection = new PostsCollection();

            // call super initializer
            BaseView.prototype.initialize.apply(this);
        },

        // enable create button if the group name was entered
        enableCreateBtn: function() {

            // get user input
            var input = this.ui.groupName.val();

            // if user input is not empty
            if (input && !_.str.isBlank(input)) {
                // enable the create button
                this.ui.createBtn.removeClass('disabled');
            } else {
                // disable ths create button
                this.ui.createBtn.addClass('disabled');
            }
        },

        // create group
        createGroup: function() {

            // create new group model
            var newGroup = new GroupModel();

            // save model with user inputed name
            newGroup.save({name: this.ui.groupName.val()}, {
                // jump to the group detail page
                success: function(model, response, options) {
                    window.location = '#group/' + model.id;
                }
            });
        }

    });
});