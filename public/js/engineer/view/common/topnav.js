define([
	'vent/vent',
	'text!templates/common/topnav.html'
], function(
	vent,
	template
) {

    var TopNav = Backbone.Marionette.ItemView.extend({

        template: template,

        className: 'navbar-header pull-right',

        initialize: function() {
        	this.listenTo(vent, 'profile:photo', this.updatePhoto);
        },

        onShow: function() {
            // this.$el.addClass('animated fadeInRight');
        },

        updatePhoto: function(arg) {

        	var $photo = this.$el.find('.nav-user-photo');

        	$photo.addClass('animated rollOut');
        	$photo.one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd', function() {
        	    $(this).attr('src', arg.src);
        	    $(this).removeClass('rollOut').addClass('rollIn');
        	});
        }

    });

    return TopNav;
});