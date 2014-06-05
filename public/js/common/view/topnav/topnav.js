define([
    'text!common/template/topnav/topnav.html',
    'common/view/topnav/event/menu',
    'common/view/topnav/message/menu',
    'common/view/topnav/notification/menu',
    'common/view/issue/main',
    'common/view/setting/main',
    'common/view/password/main'
], function(
    template,
    EventMenu,
    MessageMenu,
    NotificationMenu,
    IssueView,
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

        ui: {
            completeness: '.completeness-value',
            bar: '.progress-bar',
            searchTxt: '.form-search input',
            searchBtn: '.btn-search'
        },

        events: {
            'click #issue': 'showIssueView',
            'click #setting': 'showSettingView',
            'click #password': 'showPasswordView',
            'click @ui.searchBtn': 'onSearch'
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
            },
            messageNavRegion: {
                selector: '#message-nav',
                regionType: ReplaceRegion
            }
        },

        // initializer
        initialize: function() {

            this.model = selink.userModel;

            // create event menu
            this.eventNav = new EventMenu();

            // create notification menu
            this.notificationNav = new NotificationMenu();

            // create message menu
            this.messageNav = new MessageMenu();

            this.model.set({'completeness': this.model.completeness()}, {silent: true});
        },

        // after show
        onShow: function() {

            // show every menu
            this.eventNavRegion.show(this.eventNav);
            this.notificationNavRegion.show(this.notificationNav);
            this.messageNavRegion.show(this.messageNav);
        },

        showIssueView: function(event) {

            event.preventDefault();

            // create issue view
            var issueView = new IssueView({
                model: selink.userModel
            });

            // attention: access the selink object directly here
            selink.modalArea.show(issueView);

            selink.modalArea.$el.modal('show');
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

            // create password reset view
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
        },

        // search
        onSearch: function() {

            // do nothing if input is blank
            if (_.str.isBlank(this.ui.searchTxt.val()))
                return;

            window.location = '#search/'+ this.ui.searchTxt.val();
        }

    });
});