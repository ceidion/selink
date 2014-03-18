define([
    'text!common/template/people/main.html',
    'common/view/people/item',
], function(
    template,
    ItemView) {

    var Introductions = Backbone.Collection.extend({

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url: '/friends'
    });

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // item view container
        itemViewContainer: '.ace-thumbnails',

        // item view
        itemView: ItemView,

        // collection events
        collectionEvents: {
            'sync': 'reIsotope',
        },

        // initializer
        initialize: function() {

            var self = this;

            // create people collection
            this.collection = new Introductions();
            // fetch people
            this.collection.fetch({
                // after initialize the collection
                success: function() {
                    // change the behavior of add sub view
                    self.appendHtml = function(collectionView, itemView, index) {
                        $('.ace-thumbnails').imagesLoaded(function() {
                            // prepend new post and reIsotope
                            $('.ace-thumbnails').append(itemView.$el).isotope('appended', itemView.$el);
                        });
                    };
                }
            });
        },

        // after show
        onShow: function() {

            var self = this;

            // attach infinite scroll
            $('.ace-thumbnails').infinitescroll({
                navSelector  : '#page_nav',
                nextSelector : '#page_nav a',
                dataType: 'json',
                appendCallback: false,
                loading: {
                    msgText: '<em>友達情報をもっと読込み中・・・</em>',
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
                    $('.ace-thumbnails').infinitescroll('destroy');
                    $('.ace-thumbnails').data('infinitescroll', null);
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
            $('.ace-thumbnails').infinitescroll('destroy');
            $('.ace-thumbnails').data('infinitescroll', null);
        },

        // re-isotope after collection get synced
        reIsotope: function() {

            // use imageLoaded plugin
            $('.ace-thumbnails').imagesLoaded(function() {
                // re-isotope
                $('.ace-thumbnails').isotope({
                    layoutMode: 'selinkMasonry',
                    itemSelector : 'li',
                    resizable: false
                });
            });
        },
    });

});