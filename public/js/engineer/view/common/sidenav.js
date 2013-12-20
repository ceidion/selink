define(['text!templates/common/sidenav.html',], function(template) {

    var SideNav = Backbone.Marionette.ItemView.extend({

        template: template,

        tagName: 'ul',

        className: 'nav nav-list',

        events: {
            "click li": "activeMenu"
        },

        onShow: function() {
            // this.$el.addClass('animated fadeInLeft');
        },

        activeMenu: function(event) {
            this.$el.find('li').removeClass('active open');
            $(event.target).closest('li').addClass('active');
            $(event.target).closest('ul').closest('li').addClass('active open');
        }
    });

    return SideNav;
});