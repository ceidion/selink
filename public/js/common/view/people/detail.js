define([
    'text!common/template/people/detail.html',
    'common/collection/base',
    'common/model/post',
    'common/view/composite-isotope',
    'common/view/post/item',
    'common/view/people/history/main',
    'common/view/friend/friend'
], function(
    template,
    BaseCollection,
    PostModel,
    BaseView,
    ItemView,
    HistoryView,
    FriendsView
) {

    var PostsCollection = BaseCollection.extend({

        model: PostModel,

        url: function() {
            return '/posts?user=' + this.document.id;
        }
    });

    // profile view
    return BaseView.extend({

        // template
        template: template,

        // item view
        itemView: ItemView,

        // events
        events: {
            'click .btn-friend': 'onAddFriend',
            'click .btn-break': 'onBreakFriend'
        },

        // initializer
        initialize: function() {

            var self = this;

            // if this person's id in user's friends list
            if (_.indexOf(selink.userModel.get('friends'), this.model.get('_id')) >= 0)
                // mark him as user's friend
                this.model.set('isFriend', true, {silent:true});
            // or if this person's id in user's invitaion list
            else if (_.indexOf(selink.userModel.get('invited'), this.model.get('_id')) >= 0)
                // mark him as user's invited friend
                this.model.set('isInvited', true, {silent:true});

            // create post collection
            this.collection = new PostsCollection(null, {document: this.model});

            // call super initializer
            BaseView.prototype.initialize.apply(this);

            var employments = this.model.employments ? this.model.employments.toJSON() : [],
                educations = this.model.educations ? this.model.educations.toJSON() : [],
                qualifications = this.model.qualifications ? this.model.qualifications.toJSON() : [];

            // for create this person's timeline, combine his employments, educations, qualification together
            var unionHistory = _.union(employments, educations, qualifications);

            // filter out the item which do not have time information
            var filterHistory = _.filter(unionHistory, function(history) {
                return history.startDate || history.acquireDate;
            });
            // if this person have history item
            if (filterHistory.length) {

                // group his history item by year-month
                var groupHistory = _.groupBy(filterHistory, function(history) {
                    if (history.startDate)
                        return moment(history.startDate).format('YYYY/MM');
                    else if (history.acquireDate)
                        return moment(history.acquireDate).format('YYYY/MM');
                });
                // create array hold the model for history timeline
                var historyModels = [];
                // fill the array
                for(var date in groupHistory) {
                    historyModels.push({
                        date: date,
                        history: groupHistory[date]
                    });
                }
                // create history timeline view the model above
                this.historyView = new HistoryView({
                    // sort items
                    collection: new Backbone.Collection(historyModels, {
                        comparator: function(history) {
                            // by date desc
                            return 0 - Number(moment(history.get('date'), 'YYYY/MM').toDate().valueOf());
                        }
                    })
                });
            }

            // // if this person have friends
            // if (this.model.get('friends').length) {
            //     // show his friends info
            //     this.friendsView = new FriendsView({
            //         model: this.model
            //     });
            // }
        },

        // after render
        onRender: function() {
            // create region manager (this composite view will have Layout ability)
            this.rm = new Backbone.Marionette.RegionManager();
            // create regions
            this.regions = this.rm.addRegions({
                historyRegion: '#history',
                friendsRegion: '#friends'
            });
        },

        // after show
        onShow: function() {

            // some effect
            this.$el.addClass('animated fadeInRight');

            // // show friends view
            // if (this.friendsView)
            //     this.regions.friendsRegion.show(this.friendsView);

            // show history view
            if (this.historyView)
                this.regions.historyRegion.show(this.historyView);

            // decorate pie chart
            $('.easy-pie-chart.percentage').each(function(){
                var barColor = $(this).data('color') || '#555';
                var trackColor = '#E2E2E2';
                var size = parseInt($(this).data('size')) || 72;
                $(this).easyPieChart({
                    barColor: barColor,
                    trackColor: trackColor,
                    scaleColor: false,
                    lineCap: 'butt',
                    lineWidth: parseInt(size/10),
                    animate:false,
                    size: size
                }).css('color', barColor);
            });
        },

        // before close
        onBeforeClose: function() {
            // close region manager
            this.rm.close();
        },

        // add this person as friend
        onAddFriend: function() {

            var self = this;

            // show loading icon, and prevent user click twice
            this.$el.find('.btn-friend').button('loading');

            // post this person's info for friend creation
            this.model.save({
                _id: this.model.get('_id')
                // firstName: this.model.get('firstName'),
                // lastName: this.model.get('lastName')
            }, {
                url: '/friends',
                success: function() {
                    // change the button for success info, but won't enable it
                    self.$el.find('.btn-friend')
                            .removeClass('btn-info btn-friend')
                            .addClass('btn-success')
                            .empty()
                            .html('<i class="icon-ok light-green"></i>&nbsp;友達リクエスト送信済み');
                    // put him into invited list
                    selink.userModel.get('invited').push(self.model.get('_id'));
                },
                patch: true
            });
        },

        // break up with this person
        onBreakFriend: function() {

            var self = this;

            // show loading icon, and prevent user click twice
            this.$el.find('.btn-break').button('loading');

            // post this person's id for break up
            this.model.destroy({
                url: '/friends/' + this.model.get('_id'),
                success: function() {
                    // change the button for success info, but won't enable it
                    self.$el.find('.btn-break')
                            .removeClass('btn-info btn-break')
                            .addClass('btn-grey')
                            .empty()
                            .html('<i class="icon-ok light-green"></i>&nbsp;友達解除しました');
                    // remove him from friends list
                    var index = selink.userModel.get('friends').indexOf(self.model.get('_id'));
                    if (index > -1) {
                        selink.userModel.get('friends').splice(index, 1);
                    }
                }
            });
        }

    });
});