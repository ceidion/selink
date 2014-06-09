define([
    'text!common/template/group/groups.html',
    'common/collection/base',
    'common/view/group/empty',
    'common/view/friend/item',
    'common/model/group'
], function(
    template,
    BaseCollection,
    EmptyView,
    ItemView,
    GroupModel
) {

    var GroupsCollection = BaseCollection.extend({

        model: GroupModel,

        url: '/groups'
    });

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // item view container
        itemViewContainer: '.widget-main',

        // item view
        itemView: ItemView,

        // empty view
        emptyView: EmptyView,

        ui: {
            groupName: 'input',
            createBtn: 'button'
        },

        events: {
            'keyup input': 'enableCreateBtn',
            'click button': 'createGroup'
        },

        initialize: function() {

            // create posts collection
            this.collection = new GroupsCollection();

            this.collection.fetch();
        },

        // after show
        onShow: function() {
            // make container scrollable
            this.$el.find('.widget-main').niceScroll({
                horizrailenabled: false
            });
        },

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

        createGroup: function() {

            this.collection.create({
                name: this.ui.groupName.val()
            },{
                wait: true
            });
        }

    });
});