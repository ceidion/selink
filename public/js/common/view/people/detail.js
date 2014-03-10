define([
    'text!common/template/people/detail.html',
    'common/view/post/item',
    'common/view/people/history/main'
], function(
    template,
    ItemView,
    HistoryView
) {

    var PostsCollection = Backbone.Collection.extend({

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url: function() {
            return this.document.url() + '/posts';
        }
    });

    // profile view
    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // item view container
        itemViewContainer: '.board',

        // item view
        itemView: ItemView,

        events: {
            'click .btn-friend': 'onAddFriend',
            'click .btn-break': 'onBreakFriend'
        },

        collectionEvents: {
            'sync': 'reIsotope',
        },

        // initializer
        initialize: function() {

            if (_.indexOf(selink.userModel.get('friends'), this.model.get('_id')) >= 0)
                this.model.set('isFriend', true, {silent:true});
            else if (_.indexOf(selink.userModel.get('invited'), this.model.get('_id')) >= 0)
                this.model.set('isInvited', true, {silent:true});

            var self = this;

            this.collection = new PostsCollection();
            this.collection.document = this.model;

            this.collection.fetch({
                // after initialize the collection
                success: function() {
                    // change the behavior of add sub view
                    self.appendHtml = function(collectionView, itemView, index) {
                        // prepend new post and reIsotope
                        self.$el.find('.board').prepend(itemView.$el).isotope('reloadItems');
                    };
                }
            });

            var unionHistory = _.union(this.model.get('employments'), this.model.get('educations'), this.model.get('qualifications'));

            var filterHistory = _.filter(unionHistory, function(history) {
                return history.startDate || history.acquireDate;
            });

            var groupHistory = _.groupBy(filterHistory, function(history) {
                if (history.startDate)
                    return moment(history.startDate).format('YYYY/MM');
                else if (history.acquireDate)
                    return moment(history.acquireDate).format('YYYY/MM');
            });

            var historyModels = [];

            for(var date in groupHistory) {
                historyModels.push({
                    date: date,
                    history: groupHistory[date]
                });
            }

            this.historyView = new HistoryView({
                collection: new Backbone.Collection(historyModels, {
                    comparator: function(history) {
                        return 0 - Number(moment(history.get('date'), 'YYYY/MM').toDate().valueOf());
                    }
                })
            });
        },

        // after render
        onRender: function() {
            this.rm = new Backbone.Marionette.RegionManager();
            this.regions = this.rm.addRegions({
                historyRegion: '#history'
            });
        },

        // after show
        onShow: function() {

            this.$el.addClass('animated fadeInRight');

            this.regions.historyRegion.show(this.historyView);

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

        reIsotope: function() {

            var self = this;

            this.$el.find('.board').imagesLoaded(function() {
                self.$el.find('.board').isotope({
                    // options
                    itemSelector : '.basic-info, .post-item',
                    masonry: {
                      columnWidth: 410
                    },
                });
            });
        },

        onAddFriend: function() {

            var self = this;

            this.$el.find('.btn-friend').button('loading');

            this.model.save({
                _id: this.model.get('_id'),
                firstName: this.model.get('firstName'),
                lastName: this.model.get('lastName')
            }, {
                url: './users/' + selink.userModel.id + '/friends',
                success: function() {
                    self.$el.find('.btn-friend')
                            .removeClass('btn-info btn-friend')
                            .addClass('btn-success')
                            .empty()
                            .html('<i class="icon-ok light-green"></i>&nbsp;友達リクエスト送信済み');
                    selink.userModel.get('invited').push(self.model.get('_id'));
                },
                patch: true
            });
        },

        onBreakFriend: function() {

            var self = this;

            this.$el.find('.btn-break').button('loading');

            this.model.destroy({
                url: './users/' + selink.userModel.id + '/friends/' + this.model.get('_id'),
                success: function() {
                    self.$el.find('.btn-break')
                            .removeClass('btn-info btn-break')
                            .addClass('btn-grey')
                            .empty()
                            .html('<i class="icon-ok light-green"></i>&nbsp;友達解除しました');
                    var index = selink.userModel.get('friends').indexOf(self.model.get('_id'));
                    if (index > -1) {
                        selink.userModel.get('friends').splice(index, 1);
                    }
                }
            });
        }
    });
});