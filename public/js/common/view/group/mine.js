define([
    'text!common/template/group/mine.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/view/group/item',
    'common/model/group'
], function(
    pageTemplate,
    BaseView,
    BaseCollection,
    ItemView,
    GroupModel
) {

    var GroupsCollection = BaseCollection.extend({

        url: '/groups/mine'
    });

    return BaseView.extend({

        // Template
        template: pageTemplate,

        // child view
        childView: ItemView,

        // ui
        ui: {
            groupName: 'input',
            createBtn: 'button'
        },

        // events
        events: {
            'keyup input': 'enableCreateBtn',
            'click button': 'createGroup'
        },

        // Initializer
        initialize: function() {

            // create posts collection
            this.collection = new GroupsCollection();
        },

        // After show
        onShow: function() {

            var self = this;

            // attach infinite scroll
            this.$el.find(this.childViewContainer).infinitescroll({
                navSelector  : '#mine_page_nav',
                nextSelector : '#mine_page_nav a',
                dataType: 'json',
                appendCallback: false,
                loading: {
                    msgText: '<em>グループを読込み中・・・</em>',
                    finishedMsg: 'グループは全部読込みました',
                },
                path: function() {
                    return '/groups/mine?before=' + moment(self.collection.last().get('createDate')).unix();
                }
            }, function(json, opts) {

                // if there are more data
                if (json.length > 0)
                    // add data to collection, don't forget parse the json object
                    // this will trigger 'add' event and will call on
                    self.collection.add(json, {parse: true});
            });

            // call super onShow
            BaseView.prototype.onShow.apply(this);
        },

        // enable create button if the group name was entered
        enableCreateBtn: function() {

            // get user input
            var input = this.ui.groupName.val();

            // if user input is not empty
            if (input && !_.str.isBlank(input)) {
                // enable the create button
                this.ui.createBtn.removeClass('disabled');
            } else {
                // disable ths create button
                this.ui.createBtn.addClass('disabled');
            }
        },

        // create group
        createGroup: function() {

            // create new group model
            var newGroup = new GroupModel();

            // save model with user inputed name
            newGroup.save({name: this.ui.groupName.val()}, {
                // jump to the group detail page
                success: function(model, response, options) {
                    // sycn with user model
                    selink.user.groups.add(model);
                    // move to group detail
                    window.location = '#group/' + model.id;
                }
            });
        }

    });
});