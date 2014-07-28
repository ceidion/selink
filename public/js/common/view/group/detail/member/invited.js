define([
    'text!common/template/group/detail/member/invited.html',
    'common/collection/base',
    'common/view/group/detail/member/item-ro'
], function(
    template,
    BaseCollection,
    ItemView
) {

    var InvitedCollection = BaseCollection.extend({

        url: function() {
            return '/groups/' + this.document.id + '/connections/invited';
        }
    });

    return Backbone.Marionette.CompositeView.extend({

        // class name
        className: "widget-box transparent",

        // template
        template: template,

        // child view container
        childViewContainer: '.widget-main',

        // child view
        childView: ItemView,

        // initializer
        initialize: function() {

            this.collection = new InvitedCollection(null, {document: this.model});
            this.collection.fetch();
        },

        // after show
        onShow: function() {

            var self = this;

            // here we need a time-out call, cause this view is in a modal
            // and the modal will take a piece of time to be visible.
            // isotope only process the visible elements, if we isotope on it immediatly
            // isotope will not work. so I wait 0.5s here (niceScroll also)
            setTimeout(function() {

                // enable isotope
                self.$el.find(self.childViewContainer).isotope({
                    itemSelector : '.thumbnail-item'
                });

                self.attachHtml = function(collectionView, itemView, index) {
                    // ensure the image are loaded
                    itemView.$el.imagesLoaded(function() {
                        // prepend new item and reIsotope
                        self.$el.find(self.childViewContainer).isotope('insert', itemView.$el);
                    });
                };

                // make container scrollable
                self.$el.find('.widget-main').niceScroll({
                    horizrailenabled: false
                });

            }, 500);
        }

    });
});