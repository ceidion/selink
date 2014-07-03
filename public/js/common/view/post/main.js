define([
    'text!common/template/post/main.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/model/post',
    'common/view/post/item'
], function(
    template,
    BaseView,
    BaseCollection,
    PostModel,
    ItemView
) {

    var PostsCollection = BaseCollection.extend({

        model: PostModel,

        url: '/posts'
    });

    return BaseView.extend({

        // template
        template: template,

        // child view
        childView: ItemView,

        // ui
        ui: {
            newPost: '.wysiwyg-editor',
            btnPost: '.btn-post'
        },

        // events
        events: {
            'click .btn-post': 'onPost',
            'keyup .wysiwyg-editor': 'enablePost'
        },

        // initializer
        initialize: function() {

            this.itemEvents = _.extend({}, this.itemEvents, {
                'edit': 'showEditorModal'
            });

            // create posts collection
            this.collection = new PostsCollection();

            // call super initializer
            BaseView.prototype.initialize.apply(this);
        },

        // on render
        onRender: function() {

            // initiate wysiwyg eidtor for memo
            this.ui.newPost.ace_wysiwyg({
                toolbar_place: function(toolbar) {
                    return $(this).closest('.widget-box').find('.btn-toolbar').prepend(toolbar).children(0).addClass('inline');
                }
            }).prev().addClass('wysiwyg-style3');

            // this.ui.newPost.niceScroll();
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
                content: this.ui.newPost.cleanHtml()
            }, {
                wait: true
            });

            // clear input area
            this.ui.newPost.html("");
            // disable post button (can't post empty)
            this.ui.btnPost.addClass('disabled');
        }

    });
});