define([
    'text!common/template/post/create.html',
    'common/collection/base',
    'common/model/post',
    'common/model/group',
    'common/view/post/group'
], function(
    template,
    BaseCollection,
    PostModel,
    GroupModel,
    ItemView
) {

    var GroupsCollection = BaseCollection.extend({

        model: GroupModel,

        url: '/groups'
    });

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // class name
        className: 'widget-box widget-color-green',

        // child view container
        childViewContainer: '.dropdown-menu',

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
            'click .group-item': 'onSelectGroup',
            'keyup .wysiwyg-editor': 'enablePost'
        },

        // initializer
        initialize: function() {

            this.selectGroup = null;

            // create posts collection
            this.collection = new GroupsCollection();

            // populate collection
            this.collection.fetch();
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

        onSelectGroup: function(e) {

            e.preventDefault();

            this.selectGroup = $(e.target).closest('.group-item').attr('data-group-id');

            if (this.selectGroup) {
                var groupName = selink.userModel.groups.get(this.selectGroup).get('name');
                this.$el.find('.group-name').empty().text(groupName);
            } else {
                this.$el.find('.group-name').empty().text('グループ指定なし');
            }
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

            var self = this;

            // create new post
            this.collection.create({
                content: this.ui.newPost.cleanHtml(),
                group: this.selectGroup
            }, {
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