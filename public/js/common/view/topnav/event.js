define([
    'text!common/template/topnav/event.html',
    'common/view/topnav/event-item'
], function(
    template,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // class name
        className: 'light-blue2',

        // item view
        itemView: ItemView,

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

            var $menu = this.$el.find('.dropdown-menu');

            // event menu has max 5 items, so the menu
            // itself should has no more than 7 items (include header + footer)
            if ($menu.children().size() >= 7)
                $menu.find('li:nth-last-child(2)').slideUp(function(){
                    $(this).remove();
                });

            // insert sub view before dropdown menu's footer (this is imply a order of items)
            this.$el.find('.dropdown-footer').before(itemView.el);
        },

        // initializer
        initialize: function() {

            // filter out the past events
            var futureEvents = _.filter(this.collection.models, function(event) {
                return moment(event.get('start')).isAfter(moment());
            });

            // set the number of future events in the model
            this.model.set('eventsNum', futureEvents.length, {silent:true});
        },

        // after show
        onShow: function() {

            // keep dropdown menu open when click on the menu items.
            this.$el.find('.dropdown-menu').on('click', function(e){
                e.stopPropagation();
            });

            // if there are future events
            if (this.model.get('eventsNum') > 0) {
                // let the icon jump
                this.$el.find('.icon-tasks').addClass('icon-animated-vertical');
            }
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

        }
    });
});