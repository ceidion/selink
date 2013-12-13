define([
    'text!templates/resume/resume.html',
    'view/resume/name',
    'view/resume/gender',
], function(template, NameItem, GenderItem) {

    // PageView is the biggest frame of the application
    var PageView = Backbone.Marionette.Layout.extend({

        // Template
        template: template,

        // className: "container",

        // Events
        events: {
            // 'click #logoutBtn': 'onLogout',
            // 'click': 'onClick'
        },

        // Regions
        regions: {
            nameRegion: '#name-item',
            genderRegion: '#gender-item',
            // header: '#header',
            // content: '#content',
            // footer: '#footer'
        },

        // Initializer
        initialize: function() {

            this.nameItem = new NameItem();
            this.genderItem = new GenderItem();
            // for slide animation effect change the default
            // behavior of show view on content region
            // this.content.open = function(view) {
            //     this.$el.hide();
            //     this.$el.html(view.el);
            //     this.$el.fadeIn();
            // };
        },

        // After render
        onRender: function() {
            this.nameRegion.show(this.nameItem);
            this.genderRegion.show(this.genderItem);
            // this.listenTo(vent, 'logout:sessionTimeOut', this.doLogout);
        },

        // After show
        onShow: function() {
            $.fn.editable.defaults.mode = 'inline';
            $('#first-name').editable({
                type: 'text',
                name: 'username',
                url: '/post',
                title: 'your name'
            });

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
    });

    return PageView;
});