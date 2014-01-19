define([
    'common/view/composite-base',
    'text!admin/template/data/skill/skills.html',
    'admin/view/data/skill/skill',
    'common/collection/tags'
], function(
    BaseView,
    template,
    ItemView,
    TagsModel
) {

    var IndexView = BaseView.extend({

        // Template
        template: template,

        // item view container
        itemViewContainer: '.tag-container',

        // item view
        itemView: ItemView,

        // ui
        ui: {
            'stack': '#stack'
        },

        // Events
        events: {
            'click #stack': 'getStack'
        },

        collectionEvents: {
            'sync': 'reIsotope',
            // 'add': 'createTag',
            'change': 'updateTag',
            // 'remove': 'removeTag',
        },

        count: 1,

        // Initializer
        initialize: function() {

            this.collection = new TagsModel();
            this.collection.fetch();
        },

        // After render
        onRender: function() {
        },

        // After show
        onShow: function() {
            // $('.tag-container').isotope({
            //   // options
            //   itemSelector : '.sl-tag'
            // });
        },

        reIsotope: function() {
            $('.tag-container').isotope({
              // options
              itemSelector : '.widget-container-span'
            });
        },

        createTag: function(model) {

            var self = this;

            // safe the event
            this.collection.create(event, {

                // event saved successful
                success: function(model, response, options) {

                },
                // if error happend
                error: function(model, xhr, options) {

                }
            });
        },

        updateTag: function(model) {

            if (model.isNew()) return;

            var self = this;

            // Save the model
            model.save(null , {

                // if save success
                success: function(model, response, options) {

                },

                // if other errors happend
                error: function(model, xhr, options) {

                    var error = $.parseJSON(xhr.responseText);

                    $.gritter.add({
                        title: error.title,
                        text: error.msg,
                        sticky: true,
                        class_name: 'gritter-error gritter-center',
                    });
                },

                // use patch
                patch: true
            });
        },

        removeTag: function(model) {

            var self = this;

            model.destroy({
                success: function() {

                }
            });

        },

        getStack: function getStack() {
            var self = this;
            $.ajax({
                type: 'GET',
                url: 'http://api.stackexchange.com/2.1/tags',
                data: {
                    pagesize: 100,
                    page: self.count,
                    order: 'desc',
                    sort: 'popular',
                    site: 'stackoverflow'
                },
                // use json format
                dataType: 'jsonp',

                jsonp: 'jsonp',
                success: function(data) {
                    self.saveStack(data);
                    if (data.has_more) {
                        self.count++;
                        console.log(self.count);
                        setTimeout(self.getStack(), 1000);
                    }
                },
                error: function() {
                    console.log('suck');
                }
            });
        },

        saveStack: function(data) {
            $.ajax({
                type: 'POST',
                url: '/stack',
                data: {tag : data.items},
                // use json format
                dataType: 'json',
                success: function(data) {

                },
                error: function() {
                    console.log('suck');
                }
            });
        }
    });

    return IndexView;
});