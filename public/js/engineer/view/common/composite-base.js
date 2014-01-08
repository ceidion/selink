define(['view/common/composite-empty'], function(EmptyView) {

    var BaseView = Backbone.Marionette.CompositeView.extend({

        // Empty View
        emptyView: EmptyView,

        // common events
        events: {

            // Add a new item when add button clicked
            'click .btn-add': 'addItem',
            'mouseover .widget-header': 'attention'
        },

        // common UI
        ui: {
            addBtn: '.btn-add',
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

                // let the subview listen to univeral click event
                // itemView.listenTo(vent, 'click:universal', itemView.switchToValue);
            }
            // this happend on user click add button
            // subview's model don't have _id attribute, so it's a new model
            else {

                // hide subview for slide down effect later
                // itemView.$el.hide();

                // append the subview
                this.$el.find(this.itemViewContainer).append(itemView.el);

                itemView.$el.addClass('animated bounceIn');

                itemView.$el.one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd animationend', function() {
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

                // slide down the subview editor panel, the order is important
                // itemView.$el.show(function() {
                //     // let the subview listen to univeral click event
                //     // itemView.listenTo(vent, 'click:universal', itemView.switchToValue);
                // });
            }

            // let composite listen to the new subview's delete event
            // this.listenTo(itemView, 'item:delete', this.deleteItem);
        },

        attention: function(event) {
            $(event.target).find('i').addClass('animated swing');
            $(event.target).find('i').one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd', function() {
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

        // Delete composite item
        deleteItem: function(model) {
            // remove the specified model from collection
            this.collection.remove(model);
            // if the number of items fewer than limitation
            if (this.collection.length < this.itemLimit)
                // show the add button
                this.ui.addBtn.fadeIn('fast');
        },

        // Update model
        updateItem: function(model) {

            var self = this,
                icon = this.icon ? this.icon : 'icon-ok';

            // Save the model
            model.save(null , {

                // if save success
                success: function() {

                    // $.gritter.add({
                    //     text: '<i class="' + icon + ' icon-2x animated pulse"></i>&nbsp;&nbsp;' + self.updateMsg(model.toJSON()),
                    //     class_name: 'gritter-success'
                    // });
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

            var self = this,
                icon = this.icon ? this.icon : 'icon-ok';

            // Save the model
            model.destroy({

                // if save success
                success: function() {

                    $.gritter.add({
                        text: '<i class="' + icon + ' icon-2x animated pulse"></i>&nbsp;&nbsp;' + self.removeMsg(model.toJSON()),
                        class_name: 'gritter-warning'
                    });
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