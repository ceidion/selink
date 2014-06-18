define([
    'text!common/template/group/edit/main.html',
    'common/view/composite-isotope',
    'common/view/group/edit/cover',
    'common/view/group/edit/name',
    'common/view/group/edit/description',
    'common/view/group/edit/member',
    'common/collection/base',
    'common/model/post',
    'common/view/post/item'
], function(
    template,
    BaseView,
    CoverItem,
    NameItem,
    DescriptionItem,
    MemberItem,
    BaseCollection,
    PostModel,
    ItemView
) {

    var PostsCollection = BaseCollection.extend({

        model: PostModel,

        url: function() {
            return '/posts?group=' + this.document.id;
        }
    });

    // profile view
    return BaseView.extend({

        // template
        template: template,

        // item view
        itemView: ItemView,

        // ui
        ui: {
            newPost: '.wysiwyg-editor',
            btnPost: '.btn-post'
        },

        // events
        events: {
            'click .btn-join': 'onJoin',
            'click .btn-member': 'showMemberEditor',
            'click .btn-post': 'onPost',
            'keyup .wysiwyg-editor': 'enablePost'
        },

        // initializer
        initialize: function() {

            // create component
            this.coverItem = new CoverItem({model: this.model});
            this.nameItem = new NameItem({model: this.model});
            this.descriptionItem = new DescriptionItem({model: this.model});

            // create region manager (this composite view will have layout ability)
            this.rm = new Backbone.Marionette.RegionManager();
            // create regions
            this.regions = this.rm.addRegions({
                coverRegion: '#cover',
                nameRegion: '#name',
                descriptionRegion: '#description'
            });

            // create posts collection
            this.collection = new PostsCollection(null, {document: this.model});
            // call super initializer
            BaseView.prototype.initialize.apply(this);
        },

        // after render
        onRender: function() {

            // initiate wysiwyg eidtor for memo
            this.ui.newPost.ace_wysiwyg({
                toolbar_place: function(toolbar) {
                    return $(this).closest('.widget-box').find('.btn-toolbar').prepend(toolbar).children(0).addClass('inline');
                }
            }).prev().addClass('wysiwyg-style3');

            Backbone.Validation.bind(this);
        },

        // After show
        onShow: function() {

            // show every component
            this.regions.coverRegion.show(this.coverItem);
            this.regions.nameRegion.show(this.nameItem);
            this.regions.descriptionRegion.show(this.descriptionItem);

            // call super onShow
            BaseView.prototype.onShow.apply(this);
        },

        // before close
        onBeforeClose: function() {

            // close region manager
            this.rm.close();

            // call super onBeforeClose
            BaseView.prototype.onBeforeClose.apply(this);
        },

        // join group
        onJoin: function() {

            var self = this;

            // show loading icon, and prevent user click twice
            this.$el.find('.btn-join').button('loading');

            // create a participant in this group
            this.model.save({
                participants: selink.userModel.id //TODO: no need to pass this parameter
            }, {
                url: this.model.url() + '/join',
                success: function(model, response, options) {
                    // change the label of the add button, but still disabled
                    self.$el.find('.btn-join')
                        .removeClass('btn-info btn-join')
                        .addClass('btn-success')
                        .empty()
                        .html('<i class="ace-icon fa fa-check light-green"></i>&nbsp;参加中');
                    // sycn with user model
                    selink.userModel.groups.add(model);
                },
                patch: true,
                wait: true
            });
        },

        // edit group member
        showMemberEditor: function() {

            // create member edit dialog with this view's model
            var memberEditView = new MemberItem({
                model: this.model
            });

            // show edit dialog
            selink.modalArea.show(memberEditView);
            selink.modalArea.$el.modal('show');
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
                content: this.ui.newPost.html(),
                group: this.model.id
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