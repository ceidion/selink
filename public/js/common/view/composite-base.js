define(['common/view/composite-empty'], function(EmptyView) {

    var BaseView = Backbone.Marionette.CompositeView.extend({

        // Empty View
        emptyView: EmptyView,

        // common UI
        ui: {
            addBtn: '.btn-add',
        },

        // common events
        events: {

            // Add a new item when add button clicked
            'click .btn-add': 'addItem',
            'mouseover .widget-header': 'attention'
        },

        // Common events may happend on Collection
        collectionEvents: {
            'change': 'updateItem',
            'remove': 'removeItem',
        },

        // SubView append behavior
        appendHtml: function(collectionView, itemView, index) {

            // get subview's model
            var model = itemView.model;

            // this happend on composite initialzation.
            // if the subview's model has _id attribute, it is a existing model
            if (model.get('_id')) {

                // just append the subview
                this.$el.find(this.itemViewContainer).append(itemView.el);
            }
            // this happend on user click add button
            // subview's model don't have _id attribute, so it's a new model
            else {

                // append the subview
                this.$el.find(this.itemViewContainer).append(itemView.el);

                itemView.$el
                    .addClass('animated bounceIn')
                    .one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd animationend', function() {
                        $(this).removeClass('animated bounceIn');
                    });

                // show subview's editor panel
                if (itemView.ui && itemView.ui.editor && itemView.ui.value) {

                    itemView.ui.value.hide();

                    itemView.ui.editor.fadeIn(function() {
                        // mark this editor as opened
                        itemView.$el.addClass('sl-editor-open');
                    });
                }
            }
        },

        attention: function(event) {
            $(event.target).find('.sl-icon')
                .addClass('animated swing')
                .one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd', function() {
                    $(this).removeClass('animated swing');
                });
        },

        // Add new composite item
        addItem: function() {
            // add a new model to composite's collection
            this.collection.create();
            // if the number of items exceed the limitation
            if (this.collection.length >= this.itemLimit)
                // hide the add button
                this.ui.addBtn.fadeOut('fast');
        },

        // Update model
        updateItem: function(model) {

            var self = this;

            // Save the model
            model.save(null , {

                // if save success
                success: function() {
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

        // remove an item from collection
        removeItem: function(model) {

            var self = this;

            // Save the model
            model.destroy({

                // if save success
                success: function() {
                    // if the number of items fewer than limitation
                    if (self.collection.length < self.itemLimit)
                        // show the add button
                        self.ui.addBtn.fadeIn('fast');
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
        }

    });

    return BaseView;
});