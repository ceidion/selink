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
        itemViewContainer: this.$el,

        // item view
        itemView: ItemView,

        collectionEvents: {
            'sync': 'reIsotope',
        },

        // initializer
        initialize: function() {

            if (_.indexOf(selink.userModel.get('friends'), this.model.get('_id')) >= 0)
                this.model.set('isFriend', true, {silent:true});
            else if (_.indexOf(selink.userModel.get('invited'), this.model.get('_id')) >= 0)
                this.model.set('isInvited', true, {silent:true});

            this.collection = new PostsCollection();
            this.collection.document = this.model;

            this.collection.fetch({
                // after initialize the collection
                success: function() {
                    // change the behavior of add sub view
                    self.appendHtml = function(collectionView, itemView, index) {
                        // prepend new post and reIsotope
                        this.$el.find(this.itemViewContainer).prepend(itemView.$el).isotope('reloadItems');
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
        },

        reIsotope: function() {

            var self = this;

            this.$el.imagesLoaded(function() {
                self.$el.isotope({
                    // options
                    itemSelector : '.post-item, .isotop-item',
                    masonry: {
                      columnWidth: 410
                    },
                });
            });
        },
    });
});