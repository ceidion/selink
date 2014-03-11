define([
    'text!common/template/people/detail.html',
    'common/view/post/item',
    'common/view/people/history/main',
    'common/view/friend/friend'
], function(
    template,
    ItemView,
    HistoryView,
    FriendsView
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

            this.friendsView = new FriendsView({
                model: this.model
            });

             $.Isotope.prototype._masonryColumnShiftReset = function() {
               // layout-specific props
               var props = this.masonryColumnShift = {
                 columnBricks: []
               };
               // FIXME shouldn't have to call this again
               this._getSegments();
               var i = props.cols;
               props.colYs = [];
               while (i--) {
                 props.colYs.push( 0 );
                 // push an array, for bricks in each column
                 props.columnBricks.push([])
               }
             };

             $.Isotope.prototype._masonryColumnShiftLayout = function( $elems ) {
               var instance = this,
                   props = instance.masonryColumnShift;
               $elems.each(function(){
                 var $brick  = $(this);
                 var setY = props.colYs;

                 // get the minimum Y value from the columns
                 var minimumY = Math.min.apply( Math, setY ),
                     shortCol = 0;

                 // Find index of short column, the first from the left
                 for (var i=0, len = setY.length; i < len; i++) {
                   if ( setY[i] === minimumY ) {
                     shortCol = i;
                     break;
                   }
                 }

                 // position the brick
                 var x = props.columnWidth * shortCol,
                     y = minimumY;
                 instance._pushPosition( $brick, x, y );
                 // keep track of columnIndex
                 $.data( this, 'masonryColumnIndex', i );
                 props.columnBricks[i].push( this );

                 // apply setHeight to necessary columns
                 var setHeight = minimumY + $brick.outerHeight(true),
                     setSpan = props.cols + 1 - len;
                 for ( i=0; i < setSpan; i++ ) {
                   props.colYs[ shortCol + i ] = setHeight;
                 }

               });
             };

            $.Isotope.prototype._masonryColumnShiftGetContainerSize = function() {
               var containerHeight = Math.max.apply( Math, this.masonryColumnShift.colYs );
               return { height: containerHeight };
             };

             $.Isotope.prototype._masonryColumnShiftResizeChanged = function() {
               return this._checkIfSegmentsChanged();
             };

             $.Isotope.prototype.shiftColumnOfItem = function( itemElem, callback ) {

               var columnIndex = $.data( itemElem, 'masonryColumnIndex' );

               // don't proceed if no columnIndex
               if ( !isFinite(columnIndex) ) {
                 return;
               }

               var props = this.masonryColumnShift;
               var columnBricks = props.columnBricks[ columnIndex ];
               var $brick;
               var x = props.columnWidth * columnIndex;
               var y = 0;
               for (var i=0, len = columnBricks.length; i < len; i++) {
                 $brick = $( columnBricks[i] );
                 this._pushPosition( $brick, x, y );
                 y += $brick.outerHeight(true);
               }

               // set the size of the container
               if ( this.options.resizesContainer ) {
                 var containerStyle = this._masonryColumnShiftGetContainerSize();
                 containerStyle.height = Math.max( y, containerStyle.height );
                 this.styleQueue.push({ $el: this.element, style: containerStyle });
               }

               this._processStyleQueue( $(columnBricks), callback )

             };
        },

        // after render
        onRender: function() {
            this.rm = new Backbone.Marionette.RegionManager();
            this.regions = this.rm.addRegions({
                historyRegion: '#history',
                friendsRegion: '#friends'
            });
        },

        // after show
        onShow: function() {

            this.$el.addClass('animated fadeInRight');

            this.regions.friendsRegion.show(this.friendsView);
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
                    layoutMode: 'masonryColumnShift',
                    masonryColumnShift: {
                      columnWidth: 410
                    },
                });
            });

            this.$el.find('.post-item').hover(
              function() {
                $(this).css({ height: "+=100" });
                // note that element is passed in, not jQuery object
                self.$el.find('.board').isotope( 'shiftColumnOfItem', this );
              },
              function() {
                $(this).css({ height: "-=100" });
                self.$el.find('.board').isotope( 'shiftColumnOfItem', this );
              }
            );
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