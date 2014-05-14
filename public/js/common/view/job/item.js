define([
    'text!common/template/job/item.html',
    'common/collection/base',
    'common/view/job/collection/languages',
    'common/view/job/collection/skills',
    'common/view/job/item/languages',
    'common/view/job/item/skills',
    'common/view/job/item/matches',
    'common/view/job/edit'
], function(
    template,
    BaseCollection,
    Languages,
    Skills,
    LanguagesView,
    SkillsView,
    MatchesView,
    EditView
) {

    return Backbone.Marionette.Layout.extend({

        // template
        template: template,

        // className
        className: 'isotope-item col-xs-12 col-sm-6 col-lg-4',

        // event
        events: {
            'click .btn-edit': 'editJob',
            'click .btn-remove': 'showAlert',
            'click .btn-remove-cancel': 'hideAlert',
            'click .btn-remove-comfirm': 'onRemove',
            'mouseover': 'toggleMenuIndicator',
            'mouseout': 'toggleMenuIndicator',
            'click .btn-bookmark': 'onBookmark',
            'click .btn-match': 'onMatch',
        },

        // modelEvent
        modelEvents: {
            'change': 'onMatch',
            'change:name': 'renderName',
            'change:expiredDate': 'renderExpired',
            'change:startDate': 'renderDuration',
            'change:endDate': 'renderDuration',
            'change:priceTop': 'renderPrice',
            'change:priceBottom': 'renderPrice',
            'change:address': 'renderAddress',
            'change:remark': 'renderRemark',
            'change:foreignerAllowed': 'renderForeigner',
            'change:recruitNum': 'renderRecruit',
            'change:interviewNum': 'renderInterview',
            'change:languages': 'renderLanguages',
            'change:skills': 'renderSkills',
            'change:bookmarked': 'renderBookmark',
        },

        // regions
        regions: {
            'languageArea': '.language',
            'skillArea': '.skill',
            'matchingArea': '.matching'
        },

        // initializer
        initialize: function() {

            // create language view
            this.languagesView = new LanguagesView({
                collection: new Languages(this.model.get('languages'))
            });

            // create skill view
            this.skillsView = new SkillsView({
                collection: new Skills(this.model.get('skills'))
            });
        },

        // after render
        onRender: function() {

            this.$el.find('.btn-bookmark').tooltip({
                placement: 'top',
                title: "お気に入り"
            });
        },

        // after show
        onShow: function() {
            // show language area
            this.languageArea.show(this.languagesView);
            // show skill area
            this.skillArea.show(this.skillsView);

            this.onMatch();
        },

        // edit job
        editJob: function(e) {

            // stop defautl event behavior
            e.preventDefault();

            // create edit dialog with this view's model
            var jobEditView = new EditView({
                model: this.model
            });

            // show edit dialog
            selink.modalArea.show(jobEditView);
            selink.modalArea.$el.modal('show');
        },

        // show alert after delete link clicked
        showAlert: function(e) {

            // stop defautl event behavior
            e.preventDefault();

            var self = this;

            // show alert
            this.$el.find('.alert')
                .slideDown('fast', function() {
                    self.trigger("shiftColumn");
                })
                .find('i')
                .addClass('icon-animated-vertical');
        },

        // hide alert if user canceled the delete
        hideAlert: function() {

            var self = this;

            this.$el.find('.alert').slideUp('fast', function() {
                self.trigger("shiftColumn");
            });
        },

        // remove job
        onRemove: function() {
            this.trigger('remove');
        },

        // show operation menu indicator
        toggleMenuIndicator: function() {
            this.$el.find('.widget-header .widget-toolbar').toggleClass('hidden');
        },

        // Bookmark this posts
        onBookmark: function() {

            this.model.save({
                bookmarked: selink.userModel.get('_id') // TODO: no need to pass this parameter
            }, {
                url: '/jobs/' + this.model.get('_id') + '/bookmark',
                reIsotope: false, // do not re-isotope whole collection, that will cause image flicker
                patch: true,
                wait: true
            });
        },

        onMatch: function() {

            var self = this;

            $.ajax({
                type: 'GET',
                url: '/jobs/' + this.model.get('_id') + '/match',
                dataType: 'json',
                success: function(data) {

                    // create match view
                    self.matchesView = new MatchesView({
                        collection: new BaseCollection(data)
                    });

                    // show language view
                    self.matchingArea.show(self.matchesView);

                    self.trigger("shiftColumn");
                }
            });
        },

        renderBookmark: function() {

            // update the bookmark number
            this.$el.find('.btn-bookmark')
                .find('span')
                .empty()
                .text(this.model.get('bookmarked').length);
            // flip the icon and mark this post as bookmark
            this.$el.find('.btn-bookmark')
                .find('i')
                .removeClass('icon-star-empty')
                .addClass('icon-star')
                .slFlip();
            // remove bookmark button, can't bookmark it twice
            this.$el.find('.btn-bookmark').removeClass('btn-bookmark');
        },

        renderName: function(model, value, options) {
            this.$el.find('.name-value').empty().text(value);
        },

        renderExpired: function(model, value, options) {
            this.$el.find('.expired-value').empty().text(moment(value).calendar());

            if (moment(value).isBefore(moment()))
                this.$el.find('.widget-header').addClass('header-color-grey');
            else
                this.$el.find('.widget-header').removeClass('header-color-grey');

        },

        renderDuration: function(model, value, options) {

            var $duration = this.$el.find('.duration-value'),
                startDate = model.get('startDate'),
                endDate = model.get('endDate');

            if (startDate && endDate)
                value = moment(startDate).format('L') + '～' + moment(endDate).format('L');
            else if (startDate && !endDate)
                value = moment(startDate).format('L') + '～';
            else if (!startDate && endDate)
                value = '～' + moment(endDate).format('L');
            else
                value = '';

            if (_.str.isBlank(value))
                $duration.empty().parent().addClass('hide');
            else
                $duration.empty().text(value).parent().removeClass('hide');
        },

        renderPrice: function(model, value, options) {

            var $price = this.$el.find('.price-value'),
                priceBottom = model.get('priceBottom'),
                priceTop = model.get('priceTop');

            if (priceBottom && priceTop)
                value = priceBottom + '～' + priceTop + '万円';
            else if (priceBottom && !priceTop)
                value = priceBottom + '万円～';
            else if (!priceBottom && priceTop)
                value = '～' + priceTop + '万円';
            else
                value = '';

            if (_.str.isBlank(value))
                $price.empty().parent().addClass('hide');
            else
                $price.empty().text(value).parent().removeClass('hide');
        },

        renderAddress: function(model, value, options) {

            var $address = this.$el.find('.address-value');

            if (_.str.isBlank(value))
                $address.empty().parent().addClass('hide');
            else
                $address.empty().text(value).parent().removeClass('hide');
        },

        renderRemark: function(model, value, options) {
            this.$el.find('.remark-value').empty().html(value);
        },

        renderForeigner: function(model, value, options) {

            var $foreigner = this.$el.find('.foreigner-value');

            if (model.get('foreignerAllowed'))
                $foreigner.addClass('hide');
            else
                $foreigner.removeClass('hide');
        },

        renderRecruit: function(model, value, options) {

            var $recruit = this.$el.find('.recruit-value');

            if (_.str.isBlank(value) || value == 0)
                $recruit.empty().addClass('hide');
            else
                $recruit.empty().text('募集' + value + '人').removeClass('hide');
        },

        renderInterview: function(model, value, options) {

            var $interview = this.$el.find('.interview-value');

            if (_.str.isBlank(value) || value == 0)
                $interview.empty().addClass('hide');
            else
                $interview.empty().text('面接' + value + '回').removeClass('hide');
        },

        renderLanguages: function(model, value, options) {

            // create language area
            this.languagesView = new LanguagesView({
                collection: new Languages(this.model.get('languages'))
            });

            // show language area
            this.languageArea.show(this.languagesView);
        },

        renderSkills: function(model, value, options) {

            // create skill area
            this.skillsView = new SkillsView({
                collection: new Skills(this.model.get('skills'))
            });

            // show skill area
            this.skillArea.show(this.skillsView);
        }
    });
});