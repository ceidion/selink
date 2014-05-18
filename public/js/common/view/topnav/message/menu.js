define([
    'text!common/template/topnav/message/menu.html',
    'common/view/topnav/message/item',
    'common/view/topnav/message/empty'
], function(
    template,
    ItemView,
    EmptyView
) {

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        tagName: 'li',

        // class name
        className: 'light-green',

        // item view
        itemView: ItemView,

        itemViewContainer: '.dropdown-body',

        emptyView: EmptyView,

        // collection events
        collectionEvents: {
            'add': 'updateBadge',
            'remove': 'updateBadge'
        },

        // initializer
        initialize: function() {

            var self = this;

            this.model = new Backbone.Model();

            // create messages model(collection)
            this.collection = selink.userModel.messages;

            // set the number of messages in the model
            this.model.set('messagesNum', this.collection.length, {silent:true});

            selink.socket.on('user-message', function(data) {
                $.gritter.add({
                    title: data._from.firstName + ' ' + data._from.lastName,
                    text: data.subject,
                    image: data._from.photo,
                    time: 8000,
                    class_name: 'gritter-success'
                });

                // add the notification to collection
                self.collection.add(data);

                // if the mailboxView were displayed
                if (selink.mailboxView)
                    // add new message at the head of list
                    selink.mailboxView.inBox.collection.add(data, {at: 0, parse: true});
            });
        },

        // after show
        onShow: function() {

            // override appendHtml after the view been shown
            this.appendHtml = function(collectionView, itemView, index) {
                // insert new item into the very begining of the list
                this.$el.find('.dropdown-body').prepend(itemView.el);
            };

            // keep dropdown menu open when click on the menu items.
            this.$el.find('.dropdown-menu').on('click', function(e){
                e.stopPropagation();
            });

            // make dropdown menu scrollable
            this.$el.find('.dropdown-body').niceScroll();

            if (this.collection.length > 0)
                // let the icon swing
                this.$el.find('.fa-envelope').slJump();
        },

        // update the number badge when collection changed
        updateBadge: function() {

            var msgNum = this.collection.length;

            // badge
            var $badge = this.$el.find('.dropdown-toggle .badge');

            // if no more messages
            if (msgNum === 0)
                // remove the badge
                $badge.slFlipOutY().remove();
            // if badge not exists
            else if ($badge.length === 0)
                // create badge and show it
                $('<span class="badge badge-success">' + msgNum + '</span>')
                    .appendTo(this.$el.find('.dropdown-toggle')).slFlipInY();
            // or
            else
                // update badge
                $badge.slFlipOutY(null, function() {
                    $badge.empty().text(msgNum).removeClass('flipOutY').slFlipInY();
                });

            // update notification number on title
            this.$el.find('.title-num').empty().text(msgNum);

            if (msgNum > 0)
                // let the icon swing
                this.$el.find('.fa-envelope').slJump();
        }
    });
});