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
            'sync': 'onSync',
        },

        // item view events
        itemEvents: {
            'shiftColumn': 'shiftColumn'
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

                        // if the post is new created post
                        if (index === 0) 
                            // prepend new post and reIsotope
                            this.$el.prepend(itemView.$el).isotope('reloadItems');
                        // if the post from infinit scroll loading
                        else
                            // append post and reIsotope
                            this.$el.imagesLoaded(function() {
                                self.$el.append(itemView.$el).isotope('appended', itemView.$el);
                            });
                    };
                }
            });
        },

        // on render
        onRender: function() {

            // initiate wysiwyg eidtor for memo
            this.ui.newPost.ace_wysiwyg().prev().addClass('wysiwyg-style3');
        },

        // after show
        onShow: function() {

            var self = this;

            // attach infinite scroll
            this.$el.infinitescroll({
                navSelector  : '#page_nav',
                nextSelector : '#page_nav a',
                dataType: 'json',
                appendCallback: false,
                loading: {
                    msgText: '<em>読込み中・・・</em>',
                    finishedMsg: 'No more pages to load.',
                    img: 'http://i.imgur.com/qkKy8.gif',
                    speed: 'slow',
                },
                state: {
                    currPage: 0
                },
                path: function(pageNum) {
                    return '/users/' + self.model.get('_id') + '/posts?page=' + pageNum
                }
            }, function(json, opts) {
                // no more data
                if (json.length === 0){
                    // destroy infinite scroll, or it will affect other page
                    self.$el.infinitescroll('destroy');
                    self.$el.data('infinitescroll', null);
                } else
                    // add data to collection
                    // this will trigger 'add' event and will call on
                    // the appendHtml method that changed on initialization
                    self.collection.add(json);
            });
        },

        // before close
        onBeforeClose: function() {
            // destroy infinite scroll, or it will affect other page
            this.$el.infinitescroll('destroy');
            this.$el.data('infinitescroll', null);
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
                wait: true,
                at: 0  // new post at index 0, impile this post is newly create one
            });

            // clear input area
            this.ui.newPost.html("");
            // disable post button (can't post empty)
            this.ui.btnPost.addClass('disabled');
        },

        // re-isotope after collection get synced
        onSync: function(model_or_collection, resp, options) {

            // reIsotope is a custom option, used here for stop isotope running when single item object get synced
            // (itme object's sync event will proxy through to collection by backbone)
            if (_.has(options, 'reIsotope') && !options.reIsotope) return;

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