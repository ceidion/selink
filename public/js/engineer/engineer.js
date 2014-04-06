define([
    'common/model/user',
    'engineer/router/router',
    'engineer/controller/controller'
], function(
    UserModel,
    Router,
    Controller
) {

    // create application instance
    window.selink = new Backbone.Marionette.Application();

    // create regions
    selink.addRegions({
        pageContent: '.page-content',
        topnavArea: '#topnav-area',
        shortcutArea: '#shortcuts-area',
        sidenavArea: '#sidenav-area',
        modalArea: '#modal-area'
    });

    // before application initialization, config plug-ins
    selink.on('initialize:before', function(options) {

        // THIS IS VITAL, change the default behavior of views load template,
        // or the underscore template won't work
        Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(templateId) {

            var template = templateId;

            if (!template || template.length === 0) {
                var msg = "Could not find template: '" + templateId + "'";
                var err = new Error(msg);
                err.name = "NoTemplateError";
                throw err;
            }
            return template;
        };

        // switch page with fade effect
        Backbone.Marionette.Region.prototype.open = function(view){
            this.$el.hide();
            this.$el.html(view.el);
            this.$el.fadeIn();
        };

        // change datetime language
        moment.lang('ja');

        // custom validation method
        _.extend(Backbone.Validation.validators, {
            dateJa: function(value, attr, customValue, model) {
                if (value && !moment(value, 'YYYY/MM/DD').isValid())
                    return "有効な日付をご入力ください";
            }
        });

        // gritter setting
        $.extend($.gritter.options, {
            position: 'bottom-right',
            sticky: false,
            time: 3000,
            before_open: function(){
                if($('.gritter-item-wrapper').length >= 3)
                    return false;
            },
        });

        // body listen to click event, for close sl-editor, if any
        $('body').bind('click', closeEditor);

        /*********************************************************
            Extend isotope, add selinkMasonry.
            It should be:
                1, bootstrap grid compatible mansory
                2, column shift
                3, optional corner stamp
            all combined together
        *********************************************************/
        $.extend( $.Isotope.prototype, {

            _selinkMasonryReset: function() {
                this.selinkMasonry = {};
                // Reset do nothing, cause isotope take the first item's width as column width, and that not fit here
                // for simulate bootstrap grid system, all process was delayed until Layout method
            },

            _selinkMasonryDelayReset: function() {

                // customize: get the body width
                var bodyWidth = $('body').width(),
                    sideBarMinimized = $('#sidebar').hasClass('menu-min'),
                    sideBarWidth = 190, // the "190" is the opened side navbar
                    width;

                if (sideBarMinimized)
                    sideBarWidth = 43;

                // bootstrap grid: determine the column width
                // the "40" is the left and right padding of page body
                if (bodyWidth >= 1200)
                    width = (bodyWidth - sideBarWidth - 40)/3;
                else if (bodyWidth >= 990)
                    width = (bodyWidth - sideBarWidth - 40)/2;
                else if (bodyWidth >= 768)
                    width = (bodyWidth - 40)/2;
                else
                    width = bodyWidth - 40;

                // column width determined
                this.selinkMasonry.columnWidth = width;

                var containerSize = this.element.width(),
                    segments = Math.floor( containerSize / width );

                segments = Math.max( segments, 1 );

                // column number determined
                this.selinkMasonry.cols = segments;

                var i = this.selinkMasonry.cols;

                this.selinkMasonry.colYs = [];
                this.selinkMasonry.columnBricks = [];

                while (i--) {
                    this.selinkMasonry.colYs.push(0);
                    // cloumn shift: push an array, for bricks in each column
                    this.selinkMasonry.columnBricks.push([]);
                }

                // corner stamp
                if ( this.options.selinkMasonry && this.options.selinkMasonry.cornerStampSelector ) {

                    var $cornerStamp = this.element.find( this.options.selinkMasonry.cornerStampSelector ),

                    stampWidth = $cornerStamp.outerWidth(true) - ( this.element.width() % this.selinkMasonry.columnWidth ),
                    cornerCols = Math.ceil( stampWidth / this.selinkMasonry.columnWidth ),
                    cornerStampHeight = $cornerStamp.outerHeight(true);

                    for ( i = Math.max( this.selinkMasonry.cols - cornerCols, cornerCols ); i < this.selinkMasonry.cols; i++ ) {
                        this.selinkMasonry.colYs[i] = cornerStampHeight;
                    }
                }
            },

            _selinkMasonryLayout: function( $elems ) {

                var instance = this,
                    props = instance.selinkMasonry;

                // do not calculate layout propery every time, for add/remove item etc.
                if (_.isEmpty(props))
                    // call delayed reset method, calulate the column setting
                    this._selinkMasonryDelayReset();

                $elems.each(function(){

                    var $this  = $(this),

                    //colSpan = Math.ceil( $this.outerWidth(true) / props.columnWidth );
                    // boostrap grid: how many columns does this brick span
                    colSpan = Math.floor($this.outerWidth(true)/props.columnWidth);
                    if (colSpan < 1) colSpan = 1;
                    colSpan = Math.min(colSpan, props.cols);

                    // console.log("outerWidth:" + $this.outerWidth(true) + " -> columnWidth: " + props.columnWidth + " -> colspan: " + colSpan);

                    if (colSpan === 1) {
                        // if brick spans only one column, just like singleMode
                        instance._selinkMasonryPlaceBrick($this, props.colYs);
                    } else {
                        // brick spans more than one column
                        // how many different places could this brick fit horizontally
                        var groupCount = props.cols + 1 - colSpan,
                        groupY = [],
                        groupColY,
                        i;

                        // for each group potential horizontal position
                        for (i=0; i < groupCount; i++) {
                            // make an array of colY values for that one group
                            groupColY = props.colYs.slice(i, i+colSpan);
                            // and get the max value of the array
                            groupY[i] = Math.max.apply(Math, groupColY);
                        }

                        instance._selinkMasonryPlaceBrick($this, groupY);
                    }
                });
            },

            // worker method that places brick in the columnSet
            //   with the the minY
            _selinkMasonryPlaceBrick: function( $brick, setY ) {

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
                var x = this.selinkMasonry.columnWidth * shortCol,
                y = minimumY;

                // console.log("placement X: " + x + ", Y: " + y);

                this._pushPosition( $brick, x, y );

                // column shift: keep track of columnIndex
                $brick.data( 'selinkMasonryColumnIndex', i );
                this.selinkMasonry.columnBricks[i].push( $brick );

                // apply setHeight to necessary columns
                var setHeight = minimumY + $brick.outerHeight(true),
                setSpan = this.selinkMasonry.cols + 1 - len;
                for ( i=0; i < setSpan; i++ ) {
                    this.selinkMasonry.colYs[ shortCol + i ] = setHeight;
                }
            },

            _selinkMasonryGetContainerSize: function() {
                var containerHeight = Math.max.apply( Math, this.selinkMasonry.colYs );
                return { height: containerHeight };
            },

            _selinkMasonryResizeChanged: function() {
                return this._checkIfSegmentsChanged();
            },

            selinkShiftColumn: function( itemElem, callback ) {

                var columnIndex = $.data( itemElem, 'selinkMasonryColumnIndex' );

                // don't proceed if no columnIndex
                if ( !isFinite(columnIndex) ) {
                    return;
                }

                var props = this.selinkMasonry;
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
                    var containerStyle = this._selinkMasonryGetContainerSize();
                    containerStyle.height = Math.max( y, containerStyle.height );
                    this.styleQueue.push({ $el: this.element, style: containerStyle });
                }

                this._processStyleQueue( $(columnBricks), callback );
            }

        });
        /*********************************************************
            Extend isotope, add selinkMasonry -- end
        *********************************************************/

    });

    // initialize application
    selink.addInitializer(function(options) {

        var self = this;

        // create user model
        this.userModel = new UserModel({
            _id: $('#info-base').data('id')
        });

        // populate user model
        this.userModel.fetch({

            // on success
            success: function() {

                // make controller
                self.controller = new Controller();

                // setup router
                self.router = new Router({
                    controller: self.controller
                });

                // start history
                Backbone.history.start();
            },

            // on error
            error: function() {
                // show the error to user
            }
        });

        // initiate web socket
        this.socket = io.connect('/');

        // web socket handler
        this.socket.on('message', function(data) {
            setTimeout(function() {
                $.gritter.add({
                    title: data.title,
                    text: data.msg,
                    class_name: 'gritter-success'
                });
            }, 3000);
        });

        // web socket handler
        this.socket.on('user-login', function(data) {
            setTimeout(function() {
                $.gritter.add({
                    title: data.firstName + ' ' + data.lastName,
                    text: 'オンラインになりました',
                    image: data.photo,
                    class_name: 'gritter-success'
                });
            }, 3000);
        });

        // web socket handler
        this.socket.on('no-session', function(data) {
            setTimeout(function() {
                $.gritter.add({
                    title: 'セッションが切りました',
                    text: 'お手数ですが、もう一度ログインしてください。',
                    class_name: 'gritter-error'
                });
            }, 3000);
        });

    });

    // profile view handle the click event
    // -- switch component in editor mode to value mode
    // *from x-editable*
    var closeEditor = function(e) {
        var $target = $(e.target), i,
            exclude_classes = ['.editable-container',
                               '.ui-datepicker-header',
                               '.datepicker', //in inline mode datepicker is rendered into body
                               '.modal-backdrop',
                               '.bootstrap-wysihtml5-insert-image-modal',
                               '.bootstrap-wysihtml5-insert-link-modal'
                               ];

        //check if element is detached. It occurs when clicking in bootstrap datepicker
        if (!$.contains(document.documentElement, e.target)) {
          return;
        }

        //for some reason FF 20 generates extra event (click) in select2 widget with e.target = document
        //we need to filter it via construction below. See https://github.com/vitalets/x-editable/issues/199
        //Possibly related to http://stackoverflow.com/questions/10119793/why-does-firefox-react-differently-from-webkit-and-ie-to-click-event-on-selec
        if($target.is(document)) {
           return;
        }

        //if click inside one of exclude classes --> no nothing
        for(i=0; i<exclude_classes.length; i++) {
             if($target.is(exclude_classes[i]) || $target.parents(exclude_classes[i]).length) {
                 return;
             }
        }

        //close all open containers (except one - target)
        closeOthers(e.target);
    };

    // close all open containers (except one - target)
    var closeOthers = function(element) {

        $('.sl-editor-open').each(function(i, el){

            var $el = $(el);

            //do nothing with passed element and it's children
            if(el === element || $el.find(element).length) {
                return;
            }

            if($el.find('.form-group').hasClass('has-error')) {
                return;
            }

            // slide up the edit panel
            $el.find('.sl-editor').slideUp('fast', function() {
                // fadeIn view panel
                $el.find('.sl-value').fadeIn('fast');
            });

            $el.removeClass('sl-editor-open');
        });
    };

    return selink;
});