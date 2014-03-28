define([
    'text!common/template/post/main.html',
    'common/collection/base',
    'common/model/post',
    'common/view/post/item'
], function(
    template,
    BaseCollection,
    PostModel,
    ItemView
) {

    var PostsCollection = BaseCollection.extend({

        model: PostModel,

        url: function() {
            return this.document.url() + '/posts';
        }
    });

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // class name
        className: 'post-container',

        // item view container
        itemViewContainer: this.$el,

        // item view
        itemView: ItemView,

        // ui
        ui: {
            newPost: '.wysiwyg-editor',
            btnPost: '.btn-post'
        },

        // events
        events: {
            'click .btn-post': 'onPost',
            'keyup .wysiwyg-editor': 'enablePost'
        },

        // collection events
        collectionEvents: {
            'sync': 'reIsotope',
        },

        // item view events
        itemEvents: {
            'comment:change': 'shiftColumn'
        },

        // initializer
        initialize: function() {

            var self = this;

            // create posts collection
            this.collection = new PostsCollection(null, {document: this.model});

            // fetch posts
            this.collection.fetch({
                // after initialize the collection
                success: function() {
                    // change the behavior of add sub view
                    self.appendHtml = function(collectionView, itemView, index) {
                        // prepend new post and reIsotope
                        this.$el.prepend(itemView.$el).isotope('reloadItems');
                    };
                }
            });
        },

        // on render
        onRender: function() {

            // initiate wysiwyg eidtor for memo
            this.ui.newPost.ace_wysiwyg().prev().addClass('wysiwyg-style3');
        },

        // change the status of post button
        enablePost: function() {

            // get user input
            var input = this.ui.newPost.cleanHtml();

            // if user input is not empty
            if (input && !_.str.isBlank(input)) {
                // enable the post button
                this.ui.btnPost.removeClass('disabled');
            } else {
                // disable ths post button
                this.ui.btnPost.addClass('disabled');
            }
        },

        // new post
        onPost: function() {

            // create new post
            this.collection.create({
                content: this.ui.newPost.html()
            }, {
                wait: true
            });

            // clear input area
            this.ui.newPost.html("");
            // disable post button (can't post empty)
            this.ui.btnPost.addClass('disabled');
        },

        // re-isotope after collection get synced
        reIsotope: function() {

            var self = this;

            this.$el.imagesLoaded(function() {
                self.$el.isotope({
                    layoutMode: 'selinkMasonry',
                    itemSelector : '.post-item',
                    resizable: false
                });
            });
        },

        shiftColumn: function(event, view) {
            this.$el.isotope('selinkShiftColumn', view.el);
        }
    });
});