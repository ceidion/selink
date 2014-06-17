define([
    'text!common/template/group/main.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/view/group/item',
    'common/model/group'
], function(
    pageTemplate,
    BaseView,
    BaseCollection,
    ItemView,
    GroupModel
) {

    var GroupsCollection = BaseCollection.extend({

        model: GroupModel,

        url: '/groups'
    });

    return BaseView.extend({

        // Template
        template: pageTemplate,

        // item view
        itemView: ItemView,

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
            this.collection = new GroupsCollection();

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