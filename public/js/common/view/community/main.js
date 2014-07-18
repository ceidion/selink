define([
    'text!common/template/community/main.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/model/group',
    'common/model/post',
    'common/view/post/item'
], function(
    pageTemplate,
    BaseView,
    BaseCollection,
    GroupModel,
    PostModel,
    ItemView
) {

    var PostsCollection = BaseCollection.extend({

        model: PostModel,

        url: '/groups-posts?embed=_owner,group,comments._owner'
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
                    // sycn with user model
                    selink.userModel.groups.add(model);
                    // move to group detail
                    window.location = '#group/' + model.id;
                }
            });
        }

    });
});