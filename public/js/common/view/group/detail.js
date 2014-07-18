define([
    'text!common/template/group/detail.html',
    'text!common/template/people/popover.html',
    'common/view/composite-isotope',
    'common/view/group/detail/cover',
    'common/view/group/detail/name',
    'common/view/group/detail/description',
    'common/view/group/detail/events',
    'common/view/group/detail/member',
    'common/view/group/detail/member/participants',
    'common/view/calendar/event',
    'common/collection/base',
    'common/model/event',
    'common/model/post',
    'common/view/post/item'
], function(
    template,
    popoverTemplate,
    BaseView,
    CoverItem,
    NameItem,
    DescriptionItem,
    EventsItem,
    MemberItem,
    MembersItem,
    EventView,
    BaseCollection,
    EventModel,
    PostModel,
    ItemView
) {

    var PostsCollection = BaseCollection.extend({

        model: PostModel,

        url: function() {
            return '/groups/' + this.document.id + '/posts?embed=_owner,group,comments._owner';
        }
    });

    // profile view
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
            'click .btn-join': 'onJoin',
            'click .avatar-owner': 'toProfile',
            'click .btn-member': 'showMemberEditor',
            'click .btn-event': 'showEventEditor',
            'click .btn-post': 'onPost',
            'keyup .wysiwyg-editor': 'enablePost'
        },

        modelEvents: {
            'change:invited': 'renderInvited'
        },

        renderInvited: function() {
            this.$el.find('.invitationNum').empty().text(this.model.get('invitationNum'));
        },

        // initializer
        initialize: function() {

            if (this.model.get('isMine')) {
                // create component
                this.coverItem = new CoverItem({model: this.model});
                this.nameItem = new NameItem({model: this.model});
                this.descriptionItem = new DescriptionItem({model: this.model});
            }

            this.eventsItem = new EventsItem({collection: this.model.events});
            this.listenTo(this.eventsItem, 'ensureLayout', BaseView.prototype.ensureLayout);

            this.membersItem = new MembersItem({collection: this.model.participants});

            // create region manager (this composite view will have layout ability)
            this.rm = new Backbone.Marionette.RegionManager();
            // create regions
            this.regions = this.rm.addRegions({
                coverRegion: '#cover',
                nameRegion: '#name',
                descriptionRegion: '#description',
                eventsRegion: '#events',
                membersRegion: '#members'
            });

            // create posts collection
            this.collection = new PostsCollection(null, {document: this.model});
        },

        // after render
        onRender: function() {

            // initiate wysiwyg eidtor for memo
            this.ui.newPost.ace_wysiwyg({
                toolbar_place: function(toolbar) {
                    return $(this).closest('.widget-box').find('.btn-toolbar').prepend(toolbar).children(0).addClass('inline');
                }
            }).prev().addClass('wysiwyg-style3');

            // add popover on author photo
            this.$el.find('.avatar').popover({
                html: true,
                trigger: 'hover',
                container: 'body',
                placement: 'auto top',
                title: '<img src="' + this.model.get('_owner').cover + '" />',
                content: _.template(popoverTemplate, this.model.get('_owner')),
            });

            this.$el.find('.fa-group').tooltip({
                placement: 'top',
                title: this.model.get('memberNum') + "人参加中"
            });

            this.$el.find('.fa-paper-plane').tooltip({
                placement: 'top',
                title: this.model.get('invitationNum') + "人要請中"
            });

            // add tooltip on add button
            this.$el.find('.fa-tasks').tooltip({
                placement: 'top',
                title: "イベント" + this.model.get('eventNum') + "件"
            });

            this.$el.find('.fa-edit').tooltip({
                placement: 'top',
                title: "投稿" + this.model.get('posts').length + "件"
            });

            Backbone.Validation.bind(this);
        },

        // After show
        onShow: function() {

            if (this.model.get('isMine')) {
                // show every component
                this.regions.coverRegion.show(this.coverItem);
                this.regions.nameRegion.show(this.nameItem);
                this.regions.descriptionRegion.show(this.descriptionItem);
            }

            this.regions.eventsRegion.show(this.eventsItem);

            this.regions.membersRegion.show(this.membersItem);

            // call super onShow
            BaseView.prototype.onShow.apply(this);
        },

        // before destroy
        onBeforeDestroy: function() {

            // destroy region manager
            this.rm.destroy();

            // call super onBeforeDestroy
            BaseView.prototype.onBeforeDestroy.apply(this);
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

                    var joinedLabel = $('<span class="text-success"><i class="ace-icon fa fa-check"></i>&nbsp;参加中</span>');

                    // change the add button to label
                    self.$el.find('.btn-join').fadeOut(function() {
                        self.$el.find('.group-info').prepend(joinedLabel);
                    });

                    // hide the warning message and display the post eidtor
                    self.$el.find('.alert-area').slideUp(function() {
                        self.$el.find('.post-area').slideDown(function() {
                            self.ensureLayout();
                        });
                    });

                    // sycn with user model
                    selink.userModel.groups.add(model);
                },
                patch: true,
                wait: true
            });
        },

        // turn to user profile page
        toProfile: function(e) {

            // stop defautl link behavior
            e.preventDefault();

            // destroy the popover on user's photo
            this.$el.find('.avatar').popover('destroy');
            // turn the page manually
            window.location = '#profile/' + this.model.get('_owner')._id;
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

        // edit group event
        showEventEditor: function() {

            // create a event editor modal, pass it the event collection
            var eventModal = new EventView({
                model: new EventModel({
                    group: this.model.id,
                    start: Date()
                }),
                collection: this.model.events
            });

            // show modal
            selink.modalArea.show(eventModal);
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

            var self = this;

            // create new post
            this.collection.create({
                content: this.ui.newPost.cleanHtml(),
                group: this.model.id
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