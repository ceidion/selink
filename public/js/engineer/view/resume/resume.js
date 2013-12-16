define([
    'text!templates/resume/resume.html',
    'view/resume/name',
    'view/resume/birthday',
    'view/resume/gender',
], function(template, NameItem, BirthDayItem, GenderItem) {

    // PageView is the biggest frame of the application
    var PageView = Backbone.Marionette.Layout.extend({

        // Template
        template: template,

        // className: "container",

        // Events
        events: {
            // 'click #logoutBtn': 'onLogout',
            'click': 'closeEditor'
        },

        // Regions
        regions: {
            nameRegion: '#name-item',
            birthdayRegion: '#birthday-item',
            genderRegion: '#gender-item',
        },

        // Initializer
        initialize: function() {

            this.nameItem = new NameItem();
            this.birthdayItem = new BirthDayItem();
            this.genderItem = new GenderItem();
        },

        // After render
        onRender: function() {
            this.nameRegion.show(this.nameItem);
            this.birthdayRegion.show(this.birthdayItem);
            this.genderRegion.show(this.genderItem);
            // this.listenTo(vent, 'logout:sessionTimeOut', this.doLogout);
        },

        // After show
        onShow: function() {
            // $.fn.editable.defaults.mode = 'inline';
            // $('#first-name').editable({
            //     type: 'text',
            //     name: 'username',
            //     url: '/post',
            //     title: 'your name'
            // });

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

            // Portlets (boxes)
            $('.widget-container-span').sortable({
                connectWith: '.widget-container-span',
                items:'> .widget-box',
                opacity:0.8,
                revert:true,
                forceHelperSize:true,
                placeholder: 'widget-placeholder',
                forcePlaceholderSize:true,
                tolerance:'pointer'
            });
            // move in the page component
            // this.onPartScreen();
        },

        closeEditor: function(e) {
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
            this.closeOthers(e.target);
        },

        closeOthers: function(element) {

            $('.sl-editor-open').each(function(i, el){

                //do nothing with passed element and it's children
                if(el === element || $(el).find(element).length) {
                    return;
                }

                var $el = $(el);

                // slide up the edit panel
                $el.find('.sl-editor').slideUp('fast', function() {
                    // fadeIn view panel
                    $el.find('.sl-value').fadeIn('fast');
                });

                $el.removeClass('sl-editor-open');
            });
        },

    });

    return PageView;
});