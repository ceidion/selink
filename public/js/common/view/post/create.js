define([
    'text!common/template/post/create.html',
    'common/collection/base',
    'common/model/post',
    'common/view/post/group'
], function(
    template,
    BaseCollection,
    PostModel,
    ItemView
) {

    // groups that the user participating
    var GroupsCollection = BaseCollection.extend({

        // we don't need group model, cause we only request for group's id, name and cover
        // this will save some performance on server. and skip parsing on client model also
        // save the performance on client.

        url: function() {
            return '/users/' + this.document.id + '/groups?fields=cover,name';
        }
    });

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // class name
        className: 'btn-group',

        // child view container
        childViewContainer: '.dropdown-menu',

        // child view
        childView: ItemView,

        // events
        events: {
            'click .btn-cancel': 'onGroupClear'
        },

        // child events
        childEvents: {
            'selected': 'onGroupSelect'
        },

        // initializer
        initialize: function() {

            // create posts collection
            this.collection = new GroupsCollection(null, {document: selink.userModel});

            // populate collection
            this.collection.fetch();
        },

        // on post target group selected
        onGroupSelect: function(event, model) {

            // change label text
            this.$el.find('.group-name').empty().text(model.get('name'));
            // pass model to upper lever view
            this.trigger('group-select', model);
        },

        // on post target group canceled
        onGroupClear: function() {

            // change label text
            this.$el.find('.group-name').empty().text('グループ指定なし');
            // trigger event to notify upper lever view
            this.trigger('group-clear');
        },

    });
});