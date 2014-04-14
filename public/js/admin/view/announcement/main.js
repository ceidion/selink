define([
    'text!admin/template/announcement/main.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'admin/view/announcement/item'
], function(
    template,
    BaseView,
    BaseCollection,
    ItemView
) {

    var Announcements = BaseCollection.extend({

        url: '/announcements'
    });

    return BaseView.extend({

        // template
        template: template,

        // item view
        itemView: ItemView,

        // ui
        ui: {
            btnPost: '.btn-post'
        },

        // events
        events: {
            'click .btn-post': 'onPost',
        },

        // initializer
        initialize: function() {

            this.itemEvents = _.extend({}, this.itemEvents, {
                'edit': 'showEditorModal'
            });

            // create posts collection
            this.collection = new Announcements();

            // call super initializer
            BaseView.prototype.initialize.apply(this);
        },

        // change the status of post button
        enablePost: function() {

            // get user input
            var input = this.ui.newPost.cleanHtml();

            // if user input is not empty
            if (input && !_.str.isBlank(input)) {
                // enable the post button
                this.ui.btnPost.removeClass('disabled');
            } else {
                // disable ths post button
                this.ui.btnPost.addClass('disabled');
            }
        },

        // new post
        onPost: function() {

            // create new post
            this.collection.create({
                content: this.ui.newPost.html()
            }, {
                wait: true,
                at: 0  // new post at index 0, impile this post is newly create one
            });

            // clear input area
            this.ui.newPost.html("");
            // disable post button (can't post empty)
            this.ui.btnPost.addClass('disabled');
        }

    });
});