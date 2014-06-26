define([
    'text!common/template/people/detail/groups.html',
    'common/view/people/detail/group'
], function(
    template,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // child view container
        childViewContainer: '#group-list',

        // child view
        childView: ItemView,

        displayLimit: 3,

        // initializer
        initialize: function() {

            this.displayCount = 0;
        },

        // override appendHtml
        appendHtml: function(collectionView, itemView, index) {

            // the displayed friend item won't exceed the display limit
            if (this.displayCount < this.displayLimit) {
                this.$el.find(this.childViewContainer).append(itemView.el);

            // if the display limit was reached
            } else if (this.displayCount == this.displayLimit) {

                // draw a link to tell how many people left
                var restNum = this.collection.length - this.displayLimit;
                // TODO: where is the link lead to?
                this.$el.find(this.childViewContainer).append($('<div><a>他' + restNum + 'グループ</a></div>'));

            } else {
                return;
            }

            this.displayCount++;
        },

    });
});