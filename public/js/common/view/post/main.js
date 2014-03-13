define([
    'text!common/template/post/main.html',
    'common/collection/posts',
    'common/view/post/item'
], function(
    template,
    PostsModel,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // className: 'row',

        // item view container
        itemViewContainer: '.post-container',

        // item view
        itemView: ItemView,

        ui: {
            newPost: '.wysiwyg-editor',
            btnPost: '.btn-post'
        },

        // events
        events: {
            'click .btn-post': 'onPost',
            'keyup .wysiwyg-editor': 'enablePost'
        },

        collectionEvents: {
            'sync': 'reIsotope',
        },

        itemEvents: {
            'comment:opened': 'shiftColumn',
            'comment:closed': 'shiftColumn'
        },

        // initializer
        initialize: function() {

            var self = this;

            this.collection = new PostsModel();
            this.collection.document = this.model;
            this.collection.fetch({
                // after initialize the collection
                success: function() {
                    // change the behavior of add sub view
                    self.appendHtml = function(collectionView, itemView, index) {
                        // prepend new post and reIsotope
                        this.$el.find(this.itemViewContainer).prepend(itemView.$el).isotope('reloadItems');
                    };
                }
            });

        },

        // on render
        onRender: function() {

            // initiate wysiwyg eidtor for memo
            this.ui.newPost.ace_wysiwyg({
                toolbar_place: function(toolbar) {
                    return $(this).closest('.widget-box').find('.btn-toolbar').prepend(toolbar).children(0).addClass('inline');
                },
                toolbar:
                [
                    'font',
                    null,
                    'fontSize',
                    null,
                    {name:'bold', className:'btn-info'},
                    {name:'italic', className:'btn-info'},
                    {name:'strikethrough', className:'btn-info'},
                    {name:'underline', className:'btn-info'},
                    null,
                    {name:'insertunorderedlist', className:'btn-success'},
                    {name:'insertorderedlist', className:'btn-success'},
                    {name:'outdent', className:'btn-purple'},
                    {name:'indent', className:'btn-purple'},
                    null,
                    {name:'justifyleft', className:'btn-primary'},
                    {name:'justifycenter', className:'btn-primary'},
                    {name:'justifyright', className:'btn-primary'},
                    {name:'justifyfull', className:'btn-inverse'},
                    null,
                    {name:'createLink', className:'btn-pink'},
                    {name:'unlink', className:'btn-pink'},
                    null,
                    {name:'insertImage', className:'btn-success'},
                    null,
                    'foreColor',
                    null,
                    {name:'undo', className:'btn-grey'},
                    {name:'redo', className:'btn-grey'}
                ],
                'wysiwyg': {
                    // fileUploadError: showErrorAlert
                }
            }).prev().addClass('wysiwyg-style3');
        },

        // change the status of post button
        enablePost: function() {

            // get user input
            var input = this.ui.newPost.html();

            // if user input is not empty
            if (input && input.trim() !== "") {
                // enable the post button
                this.ui.btnPost.removeClass('disabled');
            } else {
                // disable ths post button
                this.ui.btnPost.addClass('disabled');
            }
        },

        // new post
        onPost: function() {

            this.collection.create({
                content: this.ui.newPost.html()
            }, {
                wait: true
            });

            this.ui.newPost.html("");
            this.ui.btnPost.addClass('disabled');
        },

        reIsotope: function() {
            $('.post-container').imagesLoaded(function() {
                $('.post-container').isotope({
                    layoutMode: 'selinkMasonry',
                    itemSelector : '.post-item',
                    resizable: false
                });
            });

            $(window).smartresize(function(){
                $('.post-container').isotope({
                    layoutMode: 'selinkMasonry',
                });
            });
        },

        shiftColumn: function(view) {
            console.log("shift");
            console.log(arguments);
        }
    });
});