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

        appendHtml: function(collectionView, itemView, index) {

            var self = this;

            // ensure the image are loaded
            this.$el.find(this.itemViewContainer).imagesLoaded(function() {
                // if the item is newly created one
                if (index === 0)
                    // prepend new item and reIsotope
                    self.$el.find(self.itemViewContainer).append(itemView.$el).isotope('prepended', itemView.$el);
                // if the item from infinit scroll loading
                else
                    // append item and reIsotope
                    self.$el.find(self.itemViewContainer).append(itemView.$el).isotope('appended', itemView.$el);
            });
        },

        // Initializer
        initialize: function() {

            var self = this;

            // use imageLoaded plugin
            this.$el.find(this.itemViewContainer).imagesLoaded(function() {
                // enable isotope
                self.$el.find(self.itemViewContainer).isotope({
                    itemSelector : '.isotope-item',
                    stamp: '.stamp',
                    masonry: {
                        columnWidth: '.isotope-item'
                    },
                    getSortData: {
                        createDate: function(elem) {
                            return $(elem).find('.widget-box').data('create-date');
                        }
                    },
                    sortBy: 'createDate',
                    sortAscending: false
                });
            });

            // fetch collection items
            this.collection.fetch();
        },

        // After show
        onShow: function() {

            var self = this;

            // attach infinite scroll
            this.$el.find(this.itemViewContainer).infinitescroll({
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
                // the default determine path fuction is not fit selink,
                // here just use the specific one. (from infinitescroll.js line 283)
                pathParse: function(path) {
                    if (path.match(/^(.*?page=)1(\/.*|$)/)) {
                        path = path.match(/^(.*?page=)1(\/.*|$)/).slice(1);
                        return path;
                    }
                }
            }, function(json, opts) {
                // no more data
                if (json.length === 0){
                    // destroy infinite scroll, or it will affect other page
                    self.$el.find(self.itemViewContainer).infinitescroll('destroy');
                    self.$el.find(self.itemViewContainer).data('infinitescroll', null);
                } else
                    // add data to collection, don't forget parse the json object
                    // this will trigger 'add' event and will call on
                    // the appendHtml method that changed on initialization
                    self.collection.add(json, {parse: true});
            });
        },

        // before close
        onBeforeClose: function() {
            // destroy infinite scroll, or it will affect other page
            this.$el.find(this.itemViewContainer).infinitescroll('destroy');
            this.$el.find(this.itemViewContainer).data('infinitescroll', null);
        },

        // re-isotope after collection get synced
        onSync: function(model_or_collection, resp, options) {

            var self = this;

            // reIsotope is a custom option, used here for stop isotope running when single item object get synced
            // (itme object's sync event will proxy through to collection by backbone), which gonna cause a flicker
            if (options && _.has(options, 'reIsotope') && !options.reIsotope) return;

            // use imageLoaded plugin
            this.$el.find(this.itemViewContainer).imagesLoaded(function() {
                // re-isotope
                self.$el.find(self.itemViewContainer).isotope({
                    sortBy: 'createDate',
                    sortAscending: false
                });
            });
        },

        onRemove: function(event, view) {

            this.$el.find(this.itemViewContainer).isotope('remove', view.$el).isotope('layout');

            view.model.destroy({
                success: function(model, response) {
                },
                wait: true
            });
        },

        shiftColumn: function(event, view) {
            this.$el.find(this.itemViewContainer).isotope('layout');
        }

    });
});