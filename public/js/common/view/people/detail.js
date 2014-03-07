define([
    'text!common/template/people/detail.html',
    'common/view/post/item'
], function(
    template,
    ItemView
) {

    var PostsCollection = Backbone.Collection.extend({

        idAttribute: "_id",

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url: function() {
            return this.document.url() + '/posts';
        }
    });

    // profile view
    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // item view container
        itemViewContainer: '.board',

        // item view
        itemView: ItemView,

        collectionEvents: {
            'sync': 'reIsotope',
        },

        // initializer
        initialize: function() {

            this.events = _.extend({}, this.events, {
                'click .btn-friend': 'onAddFriend',
                'click .btn-break': 'onBreakFriend'
            });

            if (_.indexOf(selink.userModel.get('friends'), this.model.get('_id')) >= 0)
                this.model.set('isFriend', true, {silent:true});
            else if (_.indexOf(selink.userModel.get('invited'), this.model.get('_id')) >= 0)
                this.model.set('isInvited', true, {silent:true});

            var self = this;

            this.collection = new PostsCollection();
            this.collection.document = this.model;

            this.collection.fetch({
                // after initialize the collection
                success: function() {
                    // change the behavior of add sub view
                    self.appendHtml = function(collectionView, itemView, index) {
                        // prepend new post and reIsotope
                        self.$el.find('.board').prepend(itemView.$el).isotope('reloadItems');
                    };
                }
            });
            // create component
            // this.photoItem = new PhotoItem({model: this.model});
            // this.nameItem = new NameItem({model: this.model});
            // this.titleItem = new TitleItem({model: this.model});
            // this.birthdayItem = new BirthDayItem({model: this.model});
            // this.genderItem = new GenderItem({model: this.model});
            // this.marriageItem = new MarriageItem({model: this.model});
            // this.nationalityItem = new NationalityItem({model: this.model});
            // this.addressItem = new AddressItem({model: this.model});
            // this.nearestStItem = new NearestStItem({model: this.model});
            // this.experienceItem = new ExperienceItem({model: this.model});
            // this.telNoItem = new TelNoItem({model: this.model});
            // this.emailItem = new EMailItem({model: this.model});
            // this.webSiteItem = new WebSiteItem({model: this.model});
            // this.bioItem = new BioItem({model: this.model});
            // this.languageComposite = new LanguageComposite({model: this.model});
            // this.skillComposite = new SkillComposite({model: this.model});
            // this.qualificationComposite = new QualificationComposite({model: this.model});
            // this.educationComposite = new EducationComposite({model: this.model});
            // this.employmentComposite = new EmploymentComposite({model: this.model});
        },

        // after render
        onRender: function() {
            // show every component
            // this.photoRegion.show(this.photoItem);
            // this.nameRegion.show(this.nameItem);
            // this.titleRegion.show(this.titleItem);
            // this.birthdayRegion.show(this.birthdayItem);
            // this.genderRegion.show(this.genderItem);
            // this.marriageRegion.show(this.marriageItem);
            // this.nationalityRegion.show(this.nationalityItem);
            // this.addressRegion.show(this.addressItem);
            // this.nearestStRegion.show(this.nearestStItem);
            // this.experienceRegion.show(this.experienceItem);
            // this.telNoRegion.show(this.telNoItem);
            // this.emailRegion.show(this.emailItem);
            // this.webSiteRegion.show(this.webSiteItem);
            // this.bioRegion.show(this.bioItem);
            // this.languageRegion.show(this.languageComposite);
            // this.skillRegion.show(this.skillComposite);
            // this.qualificationRegion.show(this.qualificationComposite);
            // this.educationRegion.show(this.educationComposite);
            // this.employmentRegion.show(this.employmentComposite);
        },

        // after show
        onShow: function() {
            this.$el.addClass('animated fadeInRight');

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
        },

        reIsotope: function() {

            var self = this;

            this.$el.find('.board').imagesLoaded(function() {
                self.$el.find('.board').isotope({
                    // options
                    itemSelector : '.basic-info, .post-item',
                    masonry: {
                      columnWidth: 410
                    },
                });
            });
        },

        onAddFriend: function() {

            var self = this;

            this.$el.find('.btn-friend').button('loading');

            selink.waitApproveModel.create({
                friendId: this.model.get('_id')
            }, {
                success: function() {
                    // self.$el.find('.btn-friend').button('reset');
                    self.$el.find('.btn-friend')
                            .removeClass('btn-info btn-friend')
                            .addClass('btn-success')
                            .empty()
                            .html('<i class="icon-ok light-green"></i>&nbsp;友達リクエスト送信済み');
                    selink.userModel.get('invited').push(self.model.get('_id'));
                }
            });
        },

        onBreakFriend: function() {

            var self = this;

            this.$el.find('.btn-break').button('loading');

            selink.friendsModel.remove(this.model.get('_id'));
            this.model.remove({
                success: function() {
                    // self.$el.find('.btn-break').button('reset');
                    self.$el.find('.btn-break')
                            .removeClass('btn-info btn-break')
                            .addClass('btn-grey')
                            .empty()
                            .html('<i class="icon-ok light-green"></i>&nbsp;友達解除しました');
                    selink.userModel.get('friends').pull(self.model.get('_id'));
                }
            });
        }
    });
});