define([
	'text!templates/common/topnav.html'
], function(
	template
) {

    var TopNav = Backbone.Marionette.ItemView.extend({

        template: template,

        className: 'navbar-header pull-right',

        modelEvents: {
            'change:photo': 'updatePhoto'
        },

        initialize: function() {
        	// this.listenTo(vent, 'profile:photo', this.updatePhoto);
        },

        onShow: function() {
            // this.$el.addClass('animated fadeInRight');
        },

        updatePhoto: function() {

            var self = this,
                $photo = this.$el.find('.nav-user-photo');

        	$photo.addClass('animated rollOut');
        	$photo.one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd animationend', function() {
        	    $(this).attr('src', self.model.get('photo'));
        	    $(this).removeClass('rollOut').addClass('rollIn');
        	});
        }

    });

    return TopNav;
});