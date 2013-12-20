define(['text!templates/common/topnav.html',], function(template) {

    var TopNav = Backbone.Marionette.ItemView.extend({

        template: template,

        className: 'navbar-header pull-right',

        onShow: function() {
            // this.$el.addClass('animated fadeInRight');
        }

    });

    return TopNav;
});