define([], function() {

    var SideNav = Backbone.View.extend({

        events: {
            "click li": "activeMenu"
        },

        activeMenu: function(event) {
            this.$el.find('li').removeClass('active open');
            $(event.target).closest('li').addClass('active');
            $(event.target).closest('ul').closest('li').addClass('active open');
        }
    });

    return SideNav;
});