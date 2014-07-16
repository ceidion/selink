define([
    'text!common/template/post/main.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/model/post',
    'common/view/post/item',
    'common/view/post/groups'
], function(
    template,
    BaseView,
    BaseCollection,
    PostModel,
    ItemView,
    GroupListView
) {

    var PostsCollection = BaseCollection.extend({

        model: PostModel,

        url: function() {
            return '/users/' + this.document.id + '/posts?&embed=_owner,group,comments._owner&per_page=10&page=0';
        }
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

            // create posts collection
            this.collection = new PostsCollection(null, {document: selink.userModel});

            // create region manager (this composite view will have layout ability)
            this.rm = new Backbone.Marionette.RegionManager();

            // create regions
            this.regions = this.rm.addRegions({
                groupListRegion: '#group-list',
            });

            // create group drop-down list view
            this.groupListView = new GroupListView();

            // listen to the group list view, for the selection of target group
            this.listenTo(this.groupListView, 'group-select', this.setGroup);
            this.listenTo(this.groupListView, 'group-clear', this.unsetGroup);
        },

        // After show
        onShow: function() {

            // display group drop-down list
            this.regions.groupListRegion.show(this.groupListView);
            // call super onShow
            BaseView.prototype.onShow.apply(this);
        },

        // on render
        onRender: function() {

            // initiate wysiwyg eidtor for post edit area
            this.ui.newPost.ace_wysiwyg({
                toolbar_place: function(toolbar) {
                    return $(this).closest('.widget-box').find('.btn-toolbar').prepend(toolbar).children(0).addClass('inline');
                }
            }).prev().addClass('wysiwyg-style3');

            // this.ui.newPost.niceScroll();
        },

        // before destroy
        onBeforeDestroy: function() {
            // destroy region manager
            this.rm.destroy();
        },

        // hold the selected group
        setGroup: function(model) {
            this.targetGroup = model;
        },

        // clear the target group
        unsetGroup: function(event) {
            this.targetGroup = null;
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

            var self = this,
                post = {
                    content: this.ui.newPost.cleanHtml()
                };

            if (this.targetGroup)
                post.group = this.targetGroup.id;

            // create new post
            this.collection.create(post, {
                success: function(model, response, options) {
                    // clear input area
                    self.ui.newPost.html("");
                    // disable post button (can't post empty)
                    self.ui.btnPost.addClass('disabled');
                },
                error: function(model, xhr, options) {

                    if (xhr.status === 413)
                        // show error
                        $.gritter.add({
                            title: '投稿は失敗しました',
                            text: 'ご投稿した内容のサイズは大きすぎたため、投稿は受入ませんでした。画像を含めて投稿する場合は、直接に画像を挿入せずに、画像リンクをご利用ください。',
                            class_name: 'gritter-error'
                        });
                },
                wait: true
            });
        }

    });
});