define([
    'text!common/template/people/detail/friends.html',
    'common/view/people/detail/friend'
], function(
    template,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // item view container
        itemViewContainer: '#friend-list',

        // item view
        itemView: ItemView,

        // initializer
        initialize: function() {

            // make the collection from user model
            // this.collection = this.model.friends;
        },

        // // override appendHtml
        // appendHtml: function(collectionView, itemView, index) {

        //     // event menu only display the future events
        //     if (moment(itemView.model.get('start')).isBefore(moment()))
        //         return;

        //     // insert sub view before dropdown menu's footer (this is imply a order of items)
        //     this.$el.find('.dropdown-body').prepend(itemView.el);
        // },

    });
});