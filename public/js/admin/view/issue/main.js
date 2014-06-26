define([
    'text!admin/template/issue/main.html',
    'common/collection/base',
    'admin/view/issue/item'
], function(
    template,
    BaseCollection,
    ItemView) {

    var Issues = BaseCollection.extend({
        url: '/issues'
    });

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // for dnd add class here
        className: 'widget-box transparent',

        // child view container
        childViewContainer: '.panel-group',

        // child view
        childView: ItemView,

        // initializer
        initialize: function() {
            this.collection = new Issues();
            this.collection.fetch();
        },

        // After show
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
                }
            }, function(json, opts) {
                // no more data
                if (json.length === 0){
                    // destroy infinite scroll, or it will affect other page
                    self.$el.infinitescroll('destroy');
                    self.$el.data('infinitescroll', null);
                } else {

                    // add data to collection
                    // this will trigger 'add' event and will call on
                    // the appendHtml method that changed on initialization
                    self.collection.add(json);
                }
            });
        },

        // before close
        onBeforeClose: function() {
            // destroy infinite scroll, or it will affect other page
            this.$el.infinitescroll('destroy');
            this.$el.data('infinitescroll', null);
        }

    });
});