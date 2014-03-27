define([
    'text!common/template/topnav/topnav.html',
    'common/view/topnav/event',
    'common/view/topnav/notification/main',
    'common/view/setting/main',
    'common/view/password/main'
], function(
    template,
    EventMenu,
    NotificationMenu,
    SettingView,
    PasswordView
) {

    var ReplaceRegion = Backbone.Marionette.Region.extend({

        open: function(view) {
            this.$el.hide();
            this.$el.replaceWith(view.el);
            this.$el.slideDown("fast");
        }
    });

    return Backbone.Marionette.Layout.extend({

        // template
        template: template,

        // class name
        className: 'navbar-header pull-right',

        ui: {
            completeness: '.completeness-value',
            bar: '.progress-bar'
        },

        events: {
            'click #setting': 'showSettingView',
            'click #password': 'showPasswordView'
        },

        // model events
        modelEvents: {
            'change:photo': 'updatePhoto',
            'change': 'updateCompleteness'
        },

        // regions
        regions: {
            eventNavRegion: {
                selector: '#event-nav',
                regionType: ReplaceRegion
            },
            notificationNavRegion: {
                selector: '#notification-nav',
                regionType: ReplaceRegion
            }
        },

        // initializer
        initialize: function() {

            // create event menu
            this.eventNav = new EventMenu({
                model: this.model
            });

            // create notification menu
            this.notificationNav = new NotificationMenu({
                model: this.model
            });

            this.model.set({'completeness': this.model.completeness()}, {silent: true});
        },

        // after show
        onShow: function() {

            // show every menu
            this.eventNavRegion.show(this.eventNav);
            this.notificationNavRegion.show(this.notificationNav);
        },

        showSettingView: function(event) {

            event.preventDefault();

            // create setting view
            var settingView = new SettingView({
                model: selink.userModel
            });

            // attention: access the selink object directly here
            selink.modalArea.show(settingView);

            selink.modalArea.$el.modal('show');
        },

        showPasswordView: function(event) {

            event.preventDefault();

            // create setting view
            var passwordView = new PasswordView({
                model: selink.userModel
            });

            // attention: access the selink object directly here
            selink.modalArea.show(passwordView);

            selink.modalArea.$el.modal('show');
        },

        // update user photo when changed
        updatePhoto: function() {

            var self = this;

            this.$el.find('.nav-user-photo').slRollOut('', function() {
                $(this).attr('src', self.model.get('photo'));
                $(this).removeClass('rollOut').addClass('rollIn');
            });
        },

        updateCompleteness: function() {

            var completeness = this.model.completeness(),
                progressClass = "progress-bar";

            if (completeness == 100) {
                progressClass += ' progress-bar-success';
            } else if (completeness > 85) {
                // progressClass = 'progress-bar';
            } else if (completeness > 70) {
                progressClass += ' progress-bar-warning';
            } else if (completeness > 50) {
                progressClass += ' progress-bar-pink';
            } else if (completeness > 30) {
                progressClass += ' progress-bar-purple';
            } else {
                progressClass += ' progress-bar-danger';
            }

            this.ui.completeness.empty().text(completeness + '%');
            this.ui.bar.removeClass().addClass(progressClass);
            this.ui.bar.css('width', completeness + '%');
        }
    });
});