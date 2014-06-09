define([
    'text!common/template/group/groups.html',
    'common/collection/base',
    'common/view/group/empty',
    'common/view/friend/item',
], function(
    template,
    BaseCollection,
    EmptyView,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // item view container
        itemViewContainer: '.widget-main',

        // item view
        itemView: ItemView,

        // empty view
        emptyView: EmptyView,

        // after show
        onShow: function() {
            // make container scrollable
            this.$el.find('.widget-main').niceScroll({
                horizrailenabled: false
            });
        }

    });
});