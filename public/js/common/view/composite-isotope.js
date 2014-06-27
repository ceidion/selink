define([], function() {

    return Backbone.Marionette.CompositeView.extend({

        // child view container
        childViewContainer: '.isotope',

        // child view events
        childEvents: {
            'remove': 'onRemove',
            'expand': 'onExpand',
            'shiftColumn': 'shiftColumn'
        },

        attachHtml: function(collectionView, itemView, index) {

            var self = this;

            // ensure the image are loaded
            this.$el.find(this.childViewContainer).imagesLoaded(function() {
                // if the item is newly created one
                if (index === 0)
                    // prepend new item and reIsotope
                    self.$el.find(self.childViewContainer).append(itemView.$el).isotope('prepended', itemView.$el);
                // if the item from infinit scroll loading
                else
                    // append item and reIsotope
                    self.$el.find(self.childViewContainer).append(itemView.$el).isotope('appended', itemView.$el);
            });
        },

        // Initializer
        initialize: function() {
            Pace.restart();
        },

        // After show
        onShow: function() {

            var self = this;

            // enable isotope
            this.$el.find(this.childViewContainer).isotope({
                itemSelector : '.isotope-item',
                stamp: '.stamp',
                masonry: {
                    columnWidth: '.isotope-item'
                },
                getSortData: {
                    createDate: function(elem) {
                        return $(elem).find('[data-create-date]').data('create-date');
                    }
                },
                sortBy: 'createDate',
                sortAscending: false
            });

            // attach infinite scroll
            this.$el.find(this.childViewContainer).infinitescroll({
                navSelector  : this.navSelector || '#page_nav',
                nextSelector : this.nextSelector || '#page_nav a',
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
                    self.$el.find(self.childViewContainer).infinitescroll('destroy');
                    self.$el.find(self.childViewContainer).data('infinitescroll', null);
                } else
                    // add data to collection, don't forget parse the json object
                    // this will trigger 'add' event and will call on
                    // the appendHtml method that changed on initialization
                    self.collection.add(json, {parse: true});
            });

            // fetch collection items
            this.collection.fetch();
        },

        // before destroy
        onBeforeDestroy: function() {
            // destroy infinite scroll, or it will affect other page
            this.$el.find(this.childViewContainer).infinitescroll('destroy');
            this.$el.find(this.childViewContainer).data('infinitescroll', null);
        },

        // remove item
        onRemove: function(view) {

            // first remove it form screen
            this.$el.find(this.childViewContainer).isotope('remove', view.$el).isotope('layout');

            // then remove the model
            view.model.destroy({
                success: function(model, response) {
                },
                wait: true
            });
        },

        // when item expanded, scorll to that item
        onExpand: function(view) {

            // must scroll after isotope finish layout, so wait 500ms here
            setTimeout(function() {
                $('html, body').animate({
                    // note that the "50" is the height of topnav
                    scrollTop: $("#" + view.model.id).offset().top - 50
                }, 500);
            }, 500);
        },

        // re-layout after item size changed
        shiftColumn: function(view) {

            var self = this;

            this.$el.find(this.childViewContainer).imagesLoaded(function() {
                self.$el.find(self.childViewContainer).isotope('layout');
            });
        }

    });
});