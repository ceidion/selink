define([
    'text!common/template/topnav/event/main.html',
    'common/collection/base',
    'common/view/topnav/event/item',
    'common/view/topnav/event/empty'
], function(
    template,
    BaseCollection,
    ItemView,
    EmptyView
) {

    var Events = BaseCollection.extend({

        url: '/events'
    });

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        tagName: 'li',

        // class name
        className: 'light-blue2',

        // item view
        itemView: ItemView,

        itemViewContainer: '.dropdown-body',

        emptyView: EmptyView,

        // collection events
        collectionEvents: {
            'add': 'updateBadge',
            'remove': 'updateBadge'
        },

        // override appendHtml
        appendHtml: function(collectionView, itemView, index) {

            // event menu only display the future events
            if (moment(itemView.model.get('start')).isBefore(moment()))
                return;

            // insert sub view before dropdown menu's footer (this is imply a order of items)
            this.$el.find('.dropdown-body').prepend(itemView.el);
        },

        // initializer
        initialize: function() {

            var self = this;

            this.model = new Backbone.Model();

            this.collection = new Events();

            this.collection.fetch({
                success: function() {
                    // filter out the past events
                    var futureEvents = _.filter(self.collection.models, function(event) {
                        return moment(event.get('start')).isAfter(moment());
                    });

                    // set the number of future events in the model
                    self.model.set('eventsNum', futureEvents.length, {silent:true});
                }
            });

        },

        // after show
        onShow: function() {

            // keep dropdown menu open when click on the menu items.
            this.$el.find('.dropdown-menu').on('click', function(e){
                e.stopPropagation();
            });

            // make dropdown menu scrollable
            this.$el.find('.dropdown-body').slimScroll({
                height: 300,
                railVisible:true
            });
        },

        // update the number badge when collection changed
        updateBadge: function() {

            // filter out the past events
            var futureEvents = _.filter(this.collection.models, function(event) {
                    return moment(event.get('start')).isAfter(moment());
                }).length;

            // badge
            var $badge = this.$el.find('.dropdown-toggle .badge');

            // if no more events
            if (futureEvents === 0)
                // remove the badge
                $badge.slFlipOutY().remove();
            // if badge not exists
            else if ($badge.length === 0)
                // create badge and show it
                $('<span class="badge badge-primary">' + futureEvents + '</span>')
                    .appendTo(this.$el.find('.dropdown-toggle')).slFlipInY();
            // or
            else
                // update badge
                $badge.slFlipOutY(null, function() {
                    $badge.empty().text(futureEvents).removeClass('flipOutY').slFlipInY();
                });

            // update notification number on title
            this.$el.find('.title-num').empty().text(futureEvents);

            if (futureEvents > 0)
                // let the icon swing
                this.$el.find('.icon-tasks').addClass('icon-animated-vertical');

        }
    });
});