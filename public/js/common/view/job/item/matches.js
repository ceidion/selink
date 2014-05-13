define([
    'text!common/template/job/item/matches.html',
    'common/view/job/empty-match',
    'common/view/job/item/match'
], function(
    template,
    emptyView,
    ItemView
) {

    return Backbone.Marionette.CollectionView.extend({

        // template
        template: template,

        // item view container
        itemViewContainer: '.match-result',

        // item view
        itemView: ItemView,

        emptyView: emptyView
    });
});