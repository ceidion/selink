define([
	'text!common/template/topnav/topnav.html'
], function(
	template
) {

    var TopNav = Backbone.Marionette.ItemView.extend({

        template: template,

        className: 'navbar-header pull-right',

        modelEvents: {
            'change:photo': 'updatePhoto',
            'change:events': 'render'
        },

        initialize: function() {
            var nearestEvents = _.filter(this.model.get('events'), function(event) {
                return moment(event.start).isAfter(moment());
            });

            nearestEvents = _.sortBy(nearestEvents, function(event) {
                return moment(event.start).valueOf();
            });

            this.model.set('nearestEvents', nearestEvents.slice(0, 5), {silent:true});
            this.model.set('nearestEventsNum', nearestEvents.length, {silent:true});
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