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

        // child view container
        childViewContainer: '.ace-thumbnails',

        // child view
        childView: ItemView,

        events: {
            'click .btn-invite': 'onInvite'
        },

        // child events
        childEvents: {
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

        },

        attachHtml: function(collectionView, itemView, index) {

            var self = this;

            // ensure the image are loaded
            this.$el.find(this.childViewContainer).imagesLoaded(function() {
                // prepend new item and reIsotope
                self.$el.find(self.childViewContainer).append(itemView.$el).isotope('appended', itemView.$el);
            });
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
                    itemSelector : '.isotope-item'
                });

                self.$el.find(self.childViewContainer).niceScroll({
                    horizrailenabled: false
                });

                // attach infinite scroll
                self.$el.find(self.childViewContainer).infinitescroll({
                    navSelector  : self.navSelector || '#page_nav_sub',
                    nextSelector : self.nextSelector || '#page_nav_sub a',
                    behavior: 'local',
                    binder: self.$el.find(self.childViewContainer),
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
                        // the attachHtml method that changed on initialization
                        self.collection.add(json, {parse: true});
                });

                self.collection.fetch();

            }, 500);

        },

        onItemClick: function(view) {

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
                        self.$el.find(self.childViewContainer).isotope('remove', view).isotope('layout');
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