define([
    'text!common/template/group/detail/member/people.html',
    'common/collection/base',
    'common/view/group/detail/member/item'
], function(
    template,
    BaseCollection,
    ItemView
) {

    var Introductions = BaseCollection.extend({

        url: '/non-friends'
    });

    return Backbone.Marionette.CompositeView.extend({

        // class name
        className: "widget-box widget-color-orange",

        // template
        template: template,

        // item view container
        itemViewContainer: '.ace-thumbnails',

        // item view
        itemView: ItemView,

        events: {
            'click .btn-invite': 'onInvite'
        },

        // item events
        itemEvents: {
            'clicked': 'onItemClick'
        },

        // initailizer
        initialize: function() {

            // selected friend will saved here temprary
            this.selectFriends = [];
            // selected friend view's $el will save here
            this.selectView = [];

            // create people collection
            this.collection = new Introductions();

            this.collection.fetch();

        },

        // after the view collection rendered
        onCompositeCollectionRendered: function() {

            var self = this;

            // here we need a time-out call, cause this view is in a modal
            // and the modal will take a piece of time to be visible.
            // isotope only process the visible elements, if we isotope on it immediatly
            // isotope will not work. so I wait 0.3s here
            setTimeout(function() {
                // enable isotope
                self.$el.find(self.itemViewContainer).isotope({
                    itemSelector : '.isotope-item'
                });

                self.appendHtml = function(collectionView, itemView, index) {
                    // ensure the image are loaded
                    self.$el.find(self.itemViewContainer).imagesLoaded(function() {
                        // prepend new item and reIsotope
                        self.$el.find(self.itemViewContainer).append(itemView.$el).isotope('appended', itemView.$el);
                    });
                };

            }, 300);
        },

        // after show
        onShow: function() {

            // TODO: niceScroll is suck, not working in modal
            // make container scrollable
            // this.$el.find(this.itemViewContainer).niceScroll({
            //     horizrailenabled: false
            // });

            var self = this;

            setTimeout(function() {
                // attach infinite scroll
                self.$el.find(self.itemViewContainer).infinitescroll({
                    navSelector  : self.navSelector || '#page_nav_sub',
                    nextSelector : self.nextSelector || '#page_nav_sub a',
                    behavior: 'local',
                    binder: self.$el.find(self.itemViewContainer),
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
            }, 300);
        },

        onItemClick: function(event, view) {

            if (_.indexOf(this.selectFriends, view.model.id) < 0) {
                this.selectFriends.push(view.model.id);
                this.selectView.push(view.$el);
            } else {
                this.selectFriends = _.without(this.selectFriends, view.model.id);
                this.selectView = _.without(this.selectView, view.$el);
            }

            if (this.selectFriends.length)
                this.$el.find('.btn-invite').removeClass('disabled');
            else
                this.$el.find('.btn-invite').addClass('disabled');
        },

        onInvite: function() {

            var self = this;

            this.model.save({
                invited: this.selectFriends
            }, {
                url: this.model.url() + '/invite',
                success: function() {

                    self.$el.find('.btn-invite').addClass('disabled');

                    _.each(self.selectView, function(view) {
                        self.$el.find(self.itemViewContainer).isotope('remove', view).isotope('layout');
                    });

                    self.selectFriends = [];
                    self.selectView = [];
                },
                patch: true,
                wait: true
            });
        }

    });
});