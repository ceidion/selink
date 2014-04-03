define([], function() {

    return Backbone.Marionette.CompositeView.extend({

        // item view container
        itemViewContainer: '.isotope',

        // collection events
        collectionEvents: {
            'sync': 'onSync',
        },

        // item view events
        itemEvents: {
            'remove': 'onRemove',
            'shiftColumn': 'shiftColumn'
        },

        // Initializer
        initialize: function() {

            var self = this;

            // fetch the posts
            this.collection.fetch({
                // after initialize the collection
                success: function() {
                    // change the behavior of add sub view
                    self.appendHtml = function(collectionView, itemView, index) {
                        // if the post is new created post
                        if (index === 0)
                            // prepend new post and reIsotope
                            this.$el.find('.isotope').prepend(itemView.$el).isotope('reloadItems');
                        // if the post from infinit scroll loading
                        else
                            // append post and reIsotope
                            this.$el.find('.isotope').imagesLoaded(function() {
                                self.$el.find('.isotope').append(itemView.$el).isotope('appended', itemView.$el);
                            });
                    };
                }
            });
        },

        // After show
        onShow: function() {

            var self = this;

            // attach infinite scroll
            this.$el.find('.isotope').infinitescroll({
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
                }
            }, function(json, opts) {
                // no more data
                if (json.length === 0){
                    // destroy infinite scroll, or it will affect other page
                    self.$el.find('.isotope').infinitescroll('destroy');
                    self.$el.find('.isotope').data('infinitescroll', null);
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
            this.$el.find('.isotope').infinitescroll('destroy');
            this.$el.find('.isotope').data('infinitescroll', null);
        },

        // re-isotope after collection get synced
        onSync: function(model_or_collection, resp, options) {

            // reIsotope is a custom option, used here for stop isotope running when single item object get synced
            // (itme object's sync event will proxy through to collection by backbone)
            if (options && _.has(options, 'reIsotope') && !options.reIsotope) return;

            var self = this;

            // use imageLoaded plugin
            this.$el.find('.isotope').imagesLoaded(function() {
                // re-isotope
                self.$el.find('.isotope').isotope({
                    layoutMode: 'selinkMasonry',
                    itemSelector : '.isotope-item',
                    resizable: false,
                    selinkMasonry: {
                      cornerStampSelector: '.corner-stamp'
                    },
                });
            });
        },

        onRemove: function(event, view) {

            this.$el.find('.isotope').isotope('remove', view.$el, function() {

                view.model.destroy({
                    success: function(model, response) {
                    },
                    wait: true
                });
            });
        },

        shiftColumn: function(event, view) {
            this.$el.find('.isotope').isotope('selinkShiftColumn', view.el);
        }

    });
});