define([
    'text!common/template/topnav/event/menu.html',
    'common/collection/base',
    'common/model/event',
    'common/view/topnav/event/item',
    'common/view/topnav/event/empty'
], function(
    template,
    BaseCollection,
    EventModel,
    ItemView,
    EmptyView
) {

    var EventsCollection = BaseCollection.extend({

        model: EventModel,

        url:  function() {
            return '/events?embed=group&start=' + moment().unix();
        },

        comparator: function(event) {
            // sort by start desc
            return Number(event.get('start').valueOf());
        }
    });

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // tag name
        tagName: 'li',

        // class name
        className: 'light-blue2',

        // child view
        childView: ItemView,

        // child view container
        childViewContainer: '.dropdown-body',

        // empty view
        emptyView: EmptyView,

        // collection events
        collectionEvents: {
            'add': 'updateBadge',
            'remove': 'updateBadge'
        },

        // initializer
        initialize: function() {

            var self = this;

            this.collection = new EventsCollection();

            // accept group event real-time
            selink.socket.on('group-event-new', function(data) {
                $.gritter.add({
                    title: '<img src="' + data.group.cover + '">',
                    text: data.group.name + 'イベント開催しました。<br/><strong>' + data.title + '</strong>',
                    time: 8000,
                    class_name: 'gritter-success'
                });
                // add the notification to collection
                self.collection.add(data);
            });

        },

        // after show
        onShow: function() {

            var self = this;

            // keep dropdown menu open when click on the menu items.
            this.$el.find('.dropdown-menu').on('click', function(e){
                e.stopPropagation();
            });

            // make dropdown menu scrollable
            this.$el.find('.dropdown-body').niceScroll();

            this.collection.fetch({
                success: function(collection, response, options) {

                    // make dropdown menu scrollable
                    self.$el.find('.dropdown-body').niceScroll();

                    if (response.length > 0) {                        
                        // let the icon swing
                        self.$el.find('.fa-tasks').slJump();

                        self.updateBadge();
                    }
                }
            });
            
        },

        // update the number badge when collection changed
        updateBadge: function() {

            // filter out the past events
            var eventNum = this.collection.length;

            // badge
            var $badge = this.$el.find('.dropdown-toggle .badge');

            // TODO: this is crap. if no more events
            if (eventNum === 0)
                // remove the badge
                $badge.slFlipOutY().remove();
            // if badge not exists
            else if ($badge.length === 0)
                // create badge and show it
                $('<span class="badge badge-primary">' + eventNum + '</span>')
                    .appendTo(this.$el.find('.dropdown-toggle')).slFlipInY();
            // or
            else
                // update badge
                $badge.slFlipOutY(null, function() {
                    $badge.empty().text(eventNum).removeClass('flipOutY').slFlipInY();
                });

            // update notification number on title
            this.$el.find('.title-num').empty().text(eventNum);

            if (eventNum > 0)
                // let the icon swing
                this.$el.find('.fa-tasks').slJump();

        }
    });
});