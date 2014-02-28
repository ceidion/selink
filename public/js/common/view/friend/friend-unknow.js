define([
    'text!common/template/friend/friend-unknow.html',
    'common/view/friend/friend-item',
], function(
    template,
    ItemView) {

    var Introductions = Backbone.Collection.extend({

        idAttribute: "_id",

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

        // isotope after collection populated
        collectionEvents: {
            'sync': 'reIsotope',
        },

        // initializer
        initialize: function() {

            var self = this;

            this.events = _.extend({}, this.events);

            // create collection
            this.collection = new Introductions();
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
        beforeClose: function() {
            // destroy infinite scroll, or it will affect other page
            $('.ace-thumbnails').infinitescroll('destroy');
            $('.ace-thumbnails').data('infinitescroll', null);
        },

        reIsotope: function() {

            $('.ace-thumbnails').imagesLoaded(function() {
                $('.ace-thumbnails').isotope({
                  // options
                  itemSelector : 'li',
                });
            });
        },
    });

});