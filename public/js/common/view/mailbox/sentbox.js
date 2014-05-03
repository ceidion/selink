define([
    'text!common/template/mailbox/sentbox.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/model/message',
    'common/view/mailbox/item'
], function(
    template,
    BaseView,
    BaseCollection,
    MessageModel,
    ItemView
) {

    var Messages = BaseCollection.extend({

        url: '/messages?category=sent',

        model: MessageModel
    });

    return BaseView.extend({

        className: 'message-list',

        // template
        template: template,

        // item view container
        itemViewContainer: '.message-container',

        // item view
        itemView: ItemView,

        // select item
        selectedItem: new Messages(),

        navSelector: '#sentbox-page-nav',

        nextSelector: '#sentbox-page-nav a',

        // ui
        ui: {
            infoBar: '.message-infobar',
            toolBar: '.message-toolbar',
            removeBtn: 'btn-remove'
        },

        // event
        events: {
            'click .toggle-all': 'toggleAll',
            'click .select-all': 'selectAll',
            'click .select-none': 'selectNone',
            'click .btn-remove': 'removeMessage',
            'click .sort-createDate': 'sortCreateDate',
            'click .sort-recipient': 'sortRecipient',
            'click .sort-subject': 'sortSubject'
        },

        // initializer
        initialize: function() {

            var self = this;

            // item events
            this.itemEvents = _.extend({}, this.itemEvents, {
                'selected': 'itemSelected',
                'unselected': 'itemUnselected'
            });

            // use imageLoaded plugin
            this.$el.find(this.itemViewContainer).imagesLoaded(function() {
                // enable isotope
                self.$el.find(self.itemViewContainer).isotope({
                    itemSelector : '.isotope-item',
                    stamp: '.stamp',
                    masonry: {
                        columnWidth: '.isotope-item'
                    },
                    getSortData: {
                        createDate: function(elem) {
                            return $(elem).find('[data-create-date]').data('create-date');
                        },
                        recipient: function(elem) {
                            return $(elem).find('.sender').text();
                        },
                        subject: function(elem) {
                            return $(elem).find('.text').text();
                        }
                    },
                    sortBy: 'createDate',
                    sortAscending: false
                });
            });

            // create collection
            this.collection = new Messages();

            // fetch collection items
            this.collection.fetch();

            this.listenTo(this.selectedItem, 'all', this.toggleTools);
        },

        // toggle tool bar
        toggleTools: function() {

            // show tool bar when selection is not empty
            if (this.selectedItem.length) {
                this.ui.infoBar.addClass('hide');
                this.ui.toolBar.removeClass('hide');
            } else {
                this.ui.infoBar.removeClass('hide');
                this.ui.toolBar.addClass('hide');
            }
        },

        // toggle selection for all message
        toggleAll: function() {

            var checked = this.$el.find('.toggle-all').prop('checked');
            checked ? this.selectAll() : this.selectNone();
        },

        // select all messages
        selectAll: function(e) {

            var self = this;

            // stop default click event
            if (e) e.preventDefault();

            // clear selected item collection
            this.selectedItem.reset();

            // for each message
            this.children.each(function(view) {
                // mark as selected
                view.selectMessage();
                // add to selected collection
                self.selectedItem.add(view.model);
            });
        },

        // unselect all messaages
        selectNone: function(e) {

            // stop default click event
            if (e) e.preventDefault();

            // clear selected item collection
            this.selectedItem.reset();
            
            // for each message
            this.children.each(function(view) {
                // mark as unselected
                view.unselectMessage();
            });
        },

        // select one message
        itemSelected: function(e, view) {
            this.selectedItem.add(view.model);
        },

        // unselect one message
        itemUnselected: function(e, view) {
            this.selectedItem.remove(view.model);
        },

        // remove selected messages
        removeMessage: function(e) {

            var self = this;

            // stop default click event
            e.preventDefault();

            // for each selected message
            this.selectedItem.each(function(model) {
                // find subview of the message and let it remove the message
                self.children.findByModel(model).removeMessage();
            });
        },

        // sort by message receive date
        sortCreateDate: function(e) {

            // stop default click event
            e.preventDefault();

            this.$el.find(this.itemViewContainer).isotope({sortBy: 'createDate'});

            this.$el.find('.sort-menu i').addClass('hide');
            this.$el.find('.sort-createDate i').removeClass('hide');
        },

        // sort by message recipient
        sortRecipient: function(e) {

            // stop default click event
            e.preventDefault();

            this.$el.find(this.itemViewContainer).isotope({sortBy: 'recipient'});

            this.$el.find('.sort-menu i').addClass('hide');
            this.$el.find('.sort-recipient i').removeClass('hide');
        },

        // sort by message subject
        sortSubject: function(e) {

            // stop default click event
            e.preventDefault();

            this.$el.find(this.itemViewContainer).isotope({sortBy: 'subject'});

            this.$el.find('.sort-menu i').addClass('hide');
            this.$el.find('.sort-subject i').removeClass('hide');
        }

    });
});